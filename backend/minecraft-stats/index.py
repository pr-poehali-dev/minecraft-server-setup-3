import json
from mcstatus import JavaServer

def handler(event: dict, context) -> dict:
    '''Получение статистики Minecraft сервера в реальном времени'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    server_address = 'fersik.aternos.me:37244'
    
    try:
        server = JavaServer.lookup(server_address)
        status = server.status()
        
        stats = {
            'online': status.players.online,
            'max': status.players.max,
            'version': status.version.name,
            'latency': round(status.latency, 1),
            'timestamp': int(status.raw.get('time', 0))
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache, must-revalidate'
            },
            'body': json.dumps(stats),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'online': 0,
                'max': 0,
                'version': '1.15.2',
                'latency': 0,
                'error': str(e)
            }),
            'isBase64Encoded': False
        }
