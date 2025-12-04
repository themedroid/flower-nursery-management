import json
import os
import psycopg2
import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Dict, Any

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

def generate_referral_code(user_id: int) -> str:
    return f"BAL{user_id:05d}"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API для авторизации и регистрации
    POST /register - регистрация нового пользователя
    POST /login - вход в систему
    POST /logout - выход из системы
    GET /me - получить текущего пользователя по токену
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        params = event.get('queryStringParameters') or {}
        action = params.get('action', '')
        
        if method == 'POST' and action == 'register':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute("SELECT id FROM users WHERE email = %s", (body_data['email'],))
            if cur.fetchone():
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email already exists'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            password_hash = hash_password(body_data['password'])
            referral_code_temp = secrets.token_hex(4).upper()
            
            cur.execute(
                "INSERT INTO users (email, password_hash, full_name, phone, role, referral_code, referred_by) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (
                    body_data['email'], password_hash, body_data.get('full_name', ''),
                    body_data.get('phone', ''), 'customer', referral_code_temp,
                    body_data.get('referred_by')
                )
            )
            user_id = cur.fetchone()[0]
            
            referral_code = generate_referral_code(user_id)
            cur.execute("UPDATE users SET referral_code = %s WHERE id = %s", (referral_code, user_id))
            
            if body_data.get('referred_by'):
                cur.execute(
                    "INSERT INTO referrals (referrer_id, referred_id, bonus_amount) VALUES (%s, %s, %s)",
                    (body_data['referred_by'], user_id, 500)
                )
            
            cur.execute(
                "INSERT INTO customers (user_id) VALUES (%s)",
                (user_id,)
            )
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'message': 'User registered successfully',
                    'user_id': user_id,
                    'referral_code': referral_code
                }, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'POST' and action == 'login':
            body_data = json.loads(event.get('body', '{}'))
            
            password_hash = hash_password(body_data['password'])
            
            cur.execute(
                "SELECT id, email, full_name, role, referral_code FROM users "
                "WHERE email = %s AND password_hash = %s AND is_active = true",
                (body_data['email'], password_hash)
            )
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid credentials'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            token = generate_token()
            expires_at = datetime.now() + timedelta(days=30)
            
            cur.execute(
                "INSERT INTO sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
                (user[0], token, expires_at)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'token': token,
                    'user': {
                        'id': user[0],
                        'email': user[1],
                        'full_name': user[2],
                        'role': user[3],
                        'referral_code': user[4]
                    }
                }, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'POST' and action == 'logout':
            headers = event.get('headers') or {}
            token = headers.get('x-auth-token') or headers.get('X-Auth-Token')
            
            if token:
                cur.execute("UPDATE sessions SET expires_at = CURRENT_TIMESTAMP WHERE token = %s", (token,))
                conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Logged out successfully'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            headers = event.get('headers') or {}
            token = headers.get('x-auth-token') or headers.get('X-Auth-Token')
            
            if not token:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No token provided'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "SELECT u.id, u.email, u.full_name, u.role, u.referral_code, u.phone "
                "FROM users u "
                "JOIN sessions s ON u.id = s.user_id "
                "WHERE s.token = %s AND s.expires_at > CURRENT_TIMESTAMP",
                (token,)
            )
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid or expired token'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'id': user[0],
                    'email': user[1],
                    'full_name': user[2],
                    'role': user[3],
                    'referral_code': user[4],
                    'phone': user[5]
                }, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid action'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()
