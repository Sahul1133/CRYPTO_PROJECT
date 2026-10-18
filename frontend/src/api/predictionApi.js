import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 12000, // 12 second client timeout
  headers: {
    "Accept": "application/json"
  }
});

export const getPrediction = async (symbol) => {
  const response = await api.get(`/predict/${symbol}`);
  return response.data;
};

export const getAllPredictions = async (limit = 100) => {
  const response = await api.get(`/predictions`, { params: { limit } });
  return response.data;
};

export const getAllCoins = async () => {
  const response = await api.get(`/coins`);
  return response.data;
};

export const getChartData = async (symbol, interval = "1h") => {
  const response = await api.get(`/chart/${symbol}`, { params: { interval } });
  return response.data;
};

export const getNews = async (symbol) => {
  const response = await api.get(`/news`, { params: { symbol } });
  return response.data;
};
