from fastapi import APIRouter, HTTPException
import feedparser
import pandas as pd
from app.prediction_service import predict_next_price
from app.services.binance_service import get_historical_data
import datetime

router = APIRouter()


@router.get("/predict/{symbol}")
def predict(symbol: str):
    try:
        result = predict_next_price(symbol)
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ModuleNotFoundError as e:
        raise HTTPException(status_code=503, detail="Missing dependency: tensorflow is not installed in the backend environment.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from app.services.binance_service import get_usdt_pairs, get_all_tickers

@router.get("/predictions")
def get_predictions():
    symbols = get_usdt_pairs(limit=50)
    
    # Fetch all live prices in one call to avoid separate requests
    try:
        live_prices = get_all_tickers()
    except Exception as e:
        print(f"Error fetching all tickers: {e}")
        live_prices = {}

    results = []
    for sym in symbols:
        try:
            live_price = live_prices.get(sym)
            result = predict_next_price(sym, live_price=live_price)
            # Add name field for the frontend
            result["name"] = sym.replace("USDT", "")
            results.append(result)
        except Exception as e:
            print(f"Error predicting for {sym}: {e}")
            pass
    return results

@router.get("/chart/{symbol}")
def get_chart(symbol: str):
    try:
        # Fetch last 24 hours of 1h data
        df = get_historical_data(symbol, interval="1h", start_str="24 hours ago")
        if len(df) == 0:
            return []
        
        # Prepare actual data points
        actual_data = []
        for index, row in df.iterrows():
            time_str = row['open_time'].strftime('%H:%M')
            actual_data.append({
                "time": time_str,
                "actual": float(row['close']),
                "predicted": float(row['close'])  # Align predicted with actual for historical points
            })
            
        # Get next prediction
        pred_result = predict_next_price(symbol)
        
        # Append future prediction point
        if actual_data:
            last_time = df.iloc[-1]['open_time']
            next_time = last_time + pd.Timedelta(hours=1)
            next_time_str = next_time.strftime('%H:%M')
            actual_data.append({
                "time": next_time_str,
                "actual": None,  # No actual price yet
                "predicted": pred_result.get("predicted_price", actual_data[-1]["actual"])
            })
            
        return actual_data
    except Exception as e:
        print(f"Error in /chart: {e}")
        return []

@router.get("/news")
def get_news(symbol: str = "BTCUSDT"):
    base_coin = symbol.replace("USDT", "").replace("BUSD", "")
    try:
        import requests
        # We can search cointelegraph RSS using Google News RSS for better coin-specific results
        res = requests.get(f'https://news.google.com/rss/search?q={base_coin}+crypto', timeout=3)
        feed = feedparser.parse(res.content)
        news_items = []
        
        # Simple sentiment keywords
        positive_words = ['surge', 'jump', 'up', 'bull', 'bullish', 'gain', 'high', 'record', 'adopt', 'buy', 'positive']
        negative_words = ['crash', 'drop', 'down', 'bear', 'bearish', 'lose', 'low', 'hack', 'sell', 'negative', 'sec', 'ban']
        
        for entry in feed.entries[:6]:
            title_lower = entry.title.lower()
            
            # Calculate simple score
            pos_score = sum(1 for word in positive_words if word in title_lower)
            neg_score = sum(1 for word in negative_words if word in title_lower)
            
            if pos_score > neg_score:
                sentiment = "positive"
                score = 0.6 + (pos_score * 0.1)
            elif neg_score > pos_score:
                sentiment = "negative"
                score = 0.4 - (neg_score * 0.1)
            else:
                sentiment = "neutral"
                score = 0.5
                
            news_items.append({
                "title": entry.title,
                "source": entry.source.title if hasattr(entry, 'source') else "Crypto News",
                "sentiment": sentiment,
                "score": min(max(score, 0.1), 0.99), # clamp between 0.1 and 0.99
                "time": entry.published if hasattr(entry, 'published') else "Recent",
                "link": entry.link
            })
            
        if not news_items:
            raise Exception("No news found for this coin")
            
        return news_items
    except Exception as e:
        print(f"Error fetching news for {symbol}: {e}")
        # Fallback news specific to the coin
        return [
            {
                "title": f"{base_coin} sees unexpected market movements",
                "source": "Fallback News",
                "sentiment": "neutral",
                "score": 0.5,
                "time": "Just now",
                "link": "#"
            }
        ]

