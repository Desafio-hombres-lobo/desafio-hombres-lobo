import { getToken } from "./auth";

export const getJSONHeaders = (): Headers => {
  const headers = new Headers();
  const token = getToken();

  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  return headers;
};
