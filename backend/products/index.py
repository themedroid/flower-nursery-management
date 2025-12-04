import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API для работы с товарами питомника
    GET / - получить все товары
    GET /?category=peonies - фильтр по категории
    POST / - добавить товар (админ)
    PUT /?id=1 - обновить товар (админ)
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            category = params.get('category')
            product_id = params.get('id')
            
            if product_id:
                cur.execute(
                    "SELECT id, name, category, price, description, image_url, badge, stock, created_at "
                    "FROM products WHERE id = %s",
                    (product_id,)
                )
                row = cur.fetchone()
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Product not found'}),
                        'isBase64Encoded': False
                    }
                
                product = {
                    'id': row[0], 'name': row[1], 'category': row[2], 'price': row[3],
                    'description': row[4], 'image_url': row[5], 'badge': row[6],
                    'stock': row[7], 'created_at': row[8].isoformat() if row[8] else None
                }
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(product, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            if category:
                cur.execute(
                    "SELECT id, name, category, price, description, image_url, badge, stock "
                    "FROM products WHERE category = %s ORDER BY created_at DESC",
                    (category,)
                )
            else:
                cur.execute(
                    "SELECT id, name, category, price, description, image_url, badge, stock "
                    "FROM products ORDER BY created_at DESC"
                )
            
            products = []
            for row in cur.fetchall():
                products.append({
                    'id': row[0], 'name': row[1], 'category': row[2], 'price': row[3],
                    'description': row[4], 'image_url': row[5], 'badge': row[6], 'stock': row[7]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(products, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                "INSERT INTO products (name, category, price, description, image_url, badge, stock) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (
                    body_data['name'], body_data['category'], body_data['price'],
                    body_data.get('description', ''), body_data.get('image_url', '/placeholder.svg'),
                    body_data.get('badge'), body_data.get('stock', 0)
                )
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': new_id, 'message': 'Product created'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            params = event.get('queryStringParameters') or {}
            product_id = params.get('id')
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Product ID required'}),
                    'isBase64Encoded': False
                }
            
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                "UPDATE products SET name=%s, category=%s, price=%s, description=%s, "
                "image_url=%s, badge=%s, stock=%s, updated_at=CURRENT_TIMESTAMP "
                "WHERE id=%s",
                (
                    body_data['name'], body_data['category'], body_data['price'],
                    body_data.get('description', ''), body_data.get('image_url', '/placeholder.svg'),
                    body_data.get('badge'), body_data.get('stock', 0), product_id
                )
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Product updated'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()
