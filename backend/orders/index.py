import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API для работы с заказами питомника
    POST / - создать заказ
    GET / - получить все заказы (админ)
    GET /?id=1 - получить конкретный заказ
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                "INSERT INTO orders (customer_name, customer_phone, customer_email, customer_address, "
                "total_amount, delivery_method, payment_method) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (
                    body_data['customer_name'], body_data['customer_phone'],
                    body_data.get('customer_email', ''), body_data.get('customer_address', ''),
                    body_data['total_amount'], body_data.get('delivery_method', 'pickup'),
                    body_data.get('payment_method', 'cash')
                )
            )
            order_id = cur.fetchone()[0]
            
            for item in body_data.get('items', []):
                cur.execute(
                    "INSERT INTO order_items (order_id, product_id, product_name, quantity, price) "
                    "VALUES (%s, %s, %s, %s, %s)",
                    (order_id, item['product_id'], item['product_name'], item['quantity'], item['price'])
                )
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'order_id': order_id, 'message': 'Order created successfully'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            params = event.get('queryStringParameters') or {}
            order_id = params.get('id')
            
            if order_id:
                cur.execute(
                    "SELECT id, customer_name, customer_phone, customer_email, customer_address, "
                    "total_amount, status, delivery_method, payment_method, created_at "
                    "FROM orders WHERE id = %s",
                    (order_id,)
                )
                row = cur.fetchone()
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Order not found'}),
                        'isBase64Encoded': False
                    }
                
                order = {
                    'id': row[0], 'customer_name': row[1], 'customer_phone': row[2],
                    'customer_email': row[3], 'customer_address': row[4], 'total_amount': row[5],
                    'status': row[6], 'delivery_method': row[7], 'payment_method': row[8],
                    'created_at': row[9].isoformat() if row[9] else None
                }
                
                cur.execute(
                    "SELECT product_name, quantity, price FROM order_items WHERE order_id = %s",
                    (order_id,)
                )
                order['items'] = [
                    {'product_name': r[0], 'quantity': r[1], 'price': r[2]}
                    for r in cur.fetchall()
                ]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(order, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "SELECT id, customer_name, customer_phone, total_amount, status, created_at "
                "FROM orders ORDER BY created_at DESC LIMIT 50"
            )
            
            orders = []
            for row in cur.fetchall():
                orders.append({
                    'id': row[0], 'customer_name': row[1], 'customer_phone': row[2],
                    'total_amount': row[3], 'status': row[4],
                    'created_at': row[5].isoformat() if row[5] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(orders, ensure_ascii=False),
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
