const urlBase = "http:127.0.0.1:8000/api";

export const construirApi = (endpoint: String) => {
  return `${urlBase}${endpoint}`;
};
