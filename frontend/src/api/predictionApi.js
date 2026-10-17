import axios from "axios";

const BASE_URL = "/api";

export const getPrediction = async (symbol) => {
    const response = await axios.get(`${BASE_URL}/predict/${symbol}`);
    return response.data;
};

export const getAllPredictions = async () => {
    const response = await axios.get(`${BASE_URL}/predictions`);
    return response.data;
};

export const getChartData = async (symbol) => {
    const response = await axios.get(`${BASE_URL}/chart/${symbol}`);
    return response.data;
};

export const getNews = async (symbol) => {
    const response = await axios.get(`${BASE_URL}/news?symbol=${symbol}`);
    return response.data;
};
