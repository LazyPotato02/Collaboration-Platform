import requests

def notify_ws(project_id, payload):
    try:
        requests.post("http://localhost:8001/broadcast", json={
            "project_id": project_id,
            "type": payload.get("type"),
            "task": payload.get("task")
        })
    except Exception as e:
        print("WS notify failed:", e)