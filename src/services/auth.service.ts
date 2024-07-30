import axios from "axios";

export const saveCredentials = async (url: string, token: string) => {
  try {
    const urlFormatted = url.endsWith("/") ? url.slice(0, -1) : url;

    localStorage.setItem("apiUrl", urlFormatted);
    localStorage.setItem("token", token);

    return true;
  } catch (error) {
    return false;
  }
};

export const verifyServer = async (url: string) => {
  const response = await axios.get(`${url}/`);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("apiUrl");
  localStorage.removeItem("token");
  localStorage.removeItem("version");
};
