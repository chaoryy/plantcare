import axios from "axios";
import {
  getMockCollection,
  addMockPlant,
  deleteMockPlant,
  MOCK_DIAGNOSE,
  MOCK_IDENTIFY,
  MOCK_RECOMMEND,
  MOCK_SCHEDULE,
  MOCK_USER,
  MOCK_WEATHER,
} from "../mock/mockData";

export const USE_MOCK = false;

const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export const authAPI = {
  register: async (data) => {
    if (USE_MOCK) {
      await delay();
      return { data: { token: "mock-token-123" } };
    }
    return api.post("/api/auth/register", data);
  },

  login: async (data) => {
    if (USE_MOCK) {
      await delay();
      return { data: { token: "mock-token-123" } };
    }
    return api.post("/api/auth/login", data);
  },
};

export const plantsAPI = {
  identify: async (imageFile) => {
    if (USE_MOCK) {
      await delay();
      return { data: MOCK_IDENTIFY };
    }
    const form = new FormData();
    form.append("image", imageFile);
    form.append("type", "identify");
    return api.post("/api/plants/analyze", form);
  },

  diagnose: async (imageFile) => {
    if (USE_MOCK) {
      await delay();
      return { data: MOCK_DIAGNOSE };
    }
    const form = new FormData();
    form.append("image", imageFile);
    form.append("type", "diagnose");
    return api.post("/api/plants/diagnose", form);
  },

  recommend: async (conditions) => {
    if (USE_MOCK) {
      await delay();
      return { data: MOCK_RECOMMEND };
    }
    return api.post("/api/plants/recommend", { conditions });
  },

  getCollection: async () => {
    if (USE_MOCK) {
      await delay();
      return { data: getMockCollection() };
    }
    return api.get("/api/plants/collection");
  },

  addToCollection: async (plantData) => {
    if (USE_MOCK) {
      await delay();
      return { data: addMockPlant(plantData) };
    }
    return api.post("/api/plants/collection", plantData);
  },

  deleteFromCollection: async (id) => {
    if (USE_MOCK) {
      await delay();
      return { data: deleteMockPlant(id) };
    }
    return api.delete(`/api/plants/collection/${id}`);
  },

  getSchedule: async () => {
    if (USE_MOCK) {
      await delay();
      return { data: MOCK_SCHEDULE };
    }
    return api.get("/api/plants/schedule");
  },
};

export const userAPI = {
  getMe: async () => {
    if (USE_MOCK) {
      await delay();
      return { data: MOCK_USER };
    }
    return api.get("/api/auth/me");
  },
};

export const weatherAPI = {
  getByCity: async (city) => {
    if (USE_MOCK) {
      await delay(300);
      return {
        data: {
          ...MOCK_WEATHER,
          city: city,
          temp: city === "Москва" ? 15 : 28,
        },
      };
    }
    return api.get("/api/weather", { params: { city } });
  },
};
