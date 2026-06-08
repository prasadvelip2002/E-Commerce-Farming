import urllib.request
import json
try:
    req = urllib.request.Request("http://localhost:8000/chat", data=b'{"message": "show products"}', headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as f:
        res = json.loads(f.read().decode('utf-8'))
        print(json.dumps(res, indent=2))
except Exception as e:
    print("Error:", e)
