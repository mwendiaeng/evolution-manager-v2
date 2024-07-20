import ApiInstance from "@/utils/instance";

export const saveCredentials = async (url: string, token: string) => {
  try {
    localStorage.setItem("apiUrl", url);
    localStorage.setItem("token", token);

    console.log(localStorage.getItem("apiUrl"), localStorage.getItem("token"));
    
    return true;
  } catch (error) {
    return false;
  }
};

export const verifyServer = async () => {
  const response = await ApiInstance.get("/");
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("apiUrl");
  localStorage.removeItem("token");
  localStorage.removeItem("version");
};
