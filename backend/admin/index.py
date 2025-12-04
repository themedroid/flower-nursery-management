import json
import os
import psycopg2
import csv
import io
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Универсальный API для админ-панели
    GET /dashboard - статистика дашборда
    GET /customers - список клиентов CRM
    GET /customers?id=1 - детали клиента
    PUT /customers?id=1 - обновить клиента
    GET /sales?days=30 - статистика продаж
    GET /products/stats - популярные товары
    GET /export?format=csv - экспорт прайс-листа
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
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
        path = params.get('path', 'dashboard')
        
        if path == 'dashboard':
            cur.execute("""
                SELECT 
                    COUNT(*) as total_orders,
                    COALESCE(SUM(total_amount), 0) as total_revenue,
                    COALESCE(AVG(total_amount), 0) as avg_order_value
                FROM orders
            """)
            orders_stats = cur.fetchone()
            
            cur.execute("SELECT COUNT(*) FROM products")
            total_products = cur.fetchone()[0]
            
            cur.execute("SELECT COUNT(*) FROM users WHERE role = 'customer'")
            total_customers = cur.fetchone()[0]
            
            cur.execute("""
                SELECT COUNT(*) 
                FROM orders 
                WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
            """)
            orders_last_month = cur.fetchone()[0]
            
            cur.execute("""
                SELECT COALESCE(SUM(total_amount), 0)
                FROM orders
                WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
            """)
            revenue_last_month = cur.fetchone()[0]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'total_orders': orders_stats[0] or 0,
                    'total_revenue': orders_stats[1] or 0,
                    'avg_order_value': int(orders_stats[2] or 0),
                    'total_products': total_products,
                    'total_customers': total_customers,
                    'orders_last_month': orders_last_month,
                    'revenue_last_month': revenue_last_month
                }, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif path == 'customers' and method == 'GET':
            customer_id = params.get('id')
            
            if customer_id:
                cur.execute("""
                    SELECT c.id, u.email, u.full_name, u.phone, c.company_name, c.address,
                           c.notes, c.discount_percent, c.total_orders, c.total_spent,
                           c.last_order_date, c.status, c.created_at
                    FROM customers c
                    JOIN users u ON c.user_id = u.id
                    WHERE c.id = %s
                """, (customer_id,))
                row = cur.fetchone()
                
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Customer not found'}, ensure_ascii=False),
                        'isBase64Encoded': False
                    }
                
                customer = {
                    'id': row[0], 'email': row[1], 'full_name': row[2], 'phone': row[3],
                    'company_name': row[4], 'address': row[5], 'notes': row[6],
                    'discount_percent': row[7], 'total_orders': row[8], 'total_spent': row[9],
                    'last_order_date': row[10].isoformat() if row[10] else None,
                    'status': row[11], 'created_at': row[12].isoformat() if row[12] else None
                }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(customer, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                SELECT c.id, u.email, u.full_name, u.phone, c.total_orders, c.total_spent,
                       c.status, c.last_order_date
                FROM customers c
                JOIN users u ON c.user_id = u.id
                ORDER BY c.total_spent DESC
                LIMIT 100
            """)
            
            customers = []
            for row in cur.fetchall():
                customers.append({
                    'id': row[0], 'email': row[1], 'full_name': row[2], 'phone': row[3],
                    'total_orders': row[4], 'total_spent': row[5], 'status': row[6],
                    'last_order_date': row[7].isoformat() if row[7] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(customers, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif path == 'customers' and method == 'PUT':
            customer_id = params.get('id')
            if not customer_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Customer ID required'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute("""
                UPDATE customers
                SET company_name = %s, address = %s, notes = %s, discount_percent = %s,
                    status = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (
                body_data.get('company_name'), body_data.get('address'),
                body_data.get('notes'), body_data.get('discount_percent', 0),
                body_data.get('status', 'active'), customer_id
            ))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Customer updated'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif path == 'sales':
            days = int(params.get('days', 30))
            
            cur.execute("""
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as orders_count,
                    COALESCE(SUM(total_amount), 0) as revenue
                FROM orders
                WHERE created_at >= CURRENT_DATE - INTERVAL '%s days'
                GROUP BY DATE(created_at)
                ORDER BY date
            """ % days)
            
            sales_data = []
            for row in cur.fetchall():
                sales_data.append({
                    'date': row[0].isoformat(),
                    'orders': row[1],
                    'revenue': row[2]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(sales_data, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif path == 'products/stats':
            cur.execute("""
                SELECT 
                    p.name,
                    p.category,
                    COUNT(oi.id) as times_ordered,
                    COALESCE(SUM(oi.quantity), 0) as total_quantity,
                    COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue
                FROM products p
                LEFT JOIN order_items oi ON p.id = oi.product_id
                GROUP BY p.id, p.name, p.category
                ORDER BY total_revenue DESC NULLS LAST
                LIMIT 10
            """)
            
            products = []
            for row in cur.fetchall():
                products.append({
                    'name': row[0],
                    'category': row[1],
                    'times_ordered': row[2] or 0,
                    'total_quantity': row[3] or 0,
                    'total_revenue': row[4] or 0
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(products, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif path == 'export':
            export_format = params.get('format', 'csv')
            
            if export_format == 'csv':
                cur.execute("""
                    SELECT name, category, price, stock, description
                    FROM products
                    ORDER BY category, name
                """)
                
                output = io.StringIO()
                writer = csv.writer(output)
                writer.writerow(['Название', 'Категория', 'Цена (₽)', 'Наличие', 'Описание'])
                
                for row in cur.fetchall():
                    category_map = {
                        'peonies': 'Пионы', 'clematis': 'Клематисы',
                        'shrubs': 'Кустарники', 'seeds': 'Семена',
                        'fertilizers': 'Удобрения', 'other': 'Другое'
                    }
                    writer.writerow([
                        row[0], category_map.get(row[1], row[1]),
                        row[2], row[3], row[4] or ''
                    ])
                
                csv_content = output.getvalue()
                output.close()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'text/csv; charset=utf-8',
                        'Content-Disposition': 'attachment; filename="pricelist.csv"',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': csv_content,
                    'isBase64Encoded': False
                }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid path'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()
