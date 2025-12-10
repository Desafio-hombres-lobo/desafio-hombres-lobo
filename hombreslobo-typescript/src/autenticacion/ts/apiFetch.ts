export const host = window.location.hostname;
export const port = "8000";
export const urlBase = `http://${host}:${port}/api`;

export const construirApi = (endpoint: String) => {
  return `${urlBase}${endpoint}`;
};
