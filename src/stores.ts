import { LocalStorage } from "@raycast/api";

export const saveAccessToken = async (accessToken: string) => {
  await LocalStorage.setItem("accessToken", accessToken);
};

export const getAccessToken = async () => {
  const accessToken = await LocalStorage.getItem<string>("accessToken");
  return accessToken?.toString();
};

export const saveUserID = async (id: string) => {
  await LocalStorage.setItem("userId", id);
};

export const getUserID = async () => {
  const accessToken = await LocalStorage.getItem("userId");
  return accessToken?.toString();
};

export const saveTag = async (tag: string) => {
  await LocalStorage.setItem("tag", tag);
};

export const getTag = async () => {
  const tag = await LocalStorage.getItem("tag");
  return tag?.toString();
};
