import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://qiita.com/api/v2/items",
});

// アクセストークンを設定するメソッド
export const setAccessToken = (token: string) => {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
