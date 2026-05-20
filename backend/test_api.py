import urllib.request
import json
import time

def test_endpoint(url):
    print(f"Testing {url}...")
    start = time.time()
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = response.read()
            print(f"Success! Length: {len(data)}, Time: {time.time()-start:.2f}s")
            # print(data[:100])
    except Exception as e:
        print(f"Failed: {e}, Time: {time.time()-start:.2f}s")

test_endpoint("http://127.0.0.1:8000/predictions")
test_endpoint("http://127.0.0.1:8000/news?symbol=BTCUSDT")
test_endpoint("http://127.0.0.1:8000/chart/BTCUSDT")
