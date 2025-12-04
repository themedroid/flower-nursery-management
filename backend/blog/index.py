import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API для работы с блогом питомника
    GET / - получить все опубликованные посты
    GET /?id=1 - получить конкретный пост
    POST / - создать пост (админ)
    PUT /?id=1 - обновить пост (админ)
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
            post_id = params.get('id')
            
            if post_id:
                cur.execute(
                    "SELECT id, title, content, excerpt, image_url, author, published, created_at "
                    "FROM blog_posts WHERE id = %s AND published = true",
                    (post_id,)
                )
                row = cur.fetchone()
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Post not found'}),
                        'isBase64Encoded': False
                    }
                
                post = {
                    'id': row[0], 'title': row[1], 'content': row[2], 'excerpt': row[3],
                    'image_url': row[4], 'author': row[5], 'published': row[6],
                    'created_at': row[7].isoformat() if row[7] else None
                }
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(post, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "SELECT id, title, excerpt, image_url, author, created_at "
                "FROM blog_posts WHERE published = true ORDER BY created_at DESC"
            )
            
            posts = []
            for row in cur.fetchall():
                posts.append({
                    'id': row[0], 'title': row[1], 'excerpt': row[2],
                    'image_url': row[3], 'author': row[4],
                    'created_at': row[5].isoformat() if row[5] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(posts, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                "INSERT INTO blog_posts (title, content, excerpt, image_url, author, published) "
                "VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                (
                    body_data['title'], body_data['content'], body_data.get('excerpt', ''),
                    body_data.get('image_url', '/placeholder.svg'),
                    body_data.get('author', 'Бал цветов'), body_data.get('published', False)
                )
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': new_id, 'message': 'Post created'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            params = event.get('queryStringParameters') or {}
            post_id = params.get('id')
            if not post_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Post ID required'}),
                    'isBase64Encoded': False
                }
            
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                "UPDATE blog_posts SET title=%s, content=%s, excerpt=%s, image_url=%s, "
                "author=%s, published=%s, updated_at=CURRENT_TIMESTAMP WHERE id=%s",
                (
                    body_data['title'], body_data['content'], body_data.get('excerpt', ''),
                    body_data.get('image_url', '/placeholder.svg'),
                    body_data.get('author', 'Бал цветов'), body_data.get('published', False),
                    post_id
                )
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Post updated'}, ensure_ascii=False),
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
