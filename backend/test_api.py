import time
import sys
from pathlib import Path
from fastapi.testclient import TestClient

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.main import app

client = TestClient(app)

def test_endpoint(path):
    print(f"\nTesting GET {path}...")
    start = time.time()
    try:
        response = client.get(path)
        elapsed = time.time() - start
        print(f"Status: {response.status_code} | Time: {elapsed:.3f}s")
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"Items returned: {len(data)}")
                if len(data) > 0:
                    first = data[0]
                    if isinstance(first, dict):
                        print(f"Sample item: {first.get('symbol', first.get('time', 'N/A'))} -> {first}")
            elif isinstance(data, dict):
                print(f"Response keys: {list(data.keys())}")
                if 'current_price' in data:
                    print(f"Price: {data['current_price']} | 1H Pred: {data['predicted_price']} | Mock: {data.get('is_mock')}")
        else:
            print(f"Error body: {response.text}")
    except Exception as e:
        print(f"Exception during request: {e}")

if __name__ == "__main__":
    print("==========================================")
    print("Running Full Backend API Integration Tests")
    print("==========================================")
    test_endpoint("/")
    test_endpoint("/api/coins")
    test_endpoint("/api/predictions")
    test_endpoint("/api/predict/BTCUSDT")
    test_endpoint("/api/predict/ETHUSDT")
    test_endpoint("/api/predict/SOLUSDT")
    test_endpoint("/api/predict/PEPEUSDT")
    test_endpoint("/api/chart/BTCUSDT?interval=1h")
    test_endpoint("/api/chart/BTCUSDT?interval=1d")
    test_endpoint("/api/news?symbol=BTCUSDT")
    print("\n==========================================")
    print("All integration tests finished!")
    print("==========================================")
