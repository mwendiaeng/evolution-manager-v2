import ApiInstance from "@/utils/instance";

export const fetchInstances = async () => {
  const response = await ApiInstance.get("/instance/fetchInstances");
  return response.data;
};

export const restart = async () => {
  const response = await ApiInstance.delete("/instance/restart");
  return response.data;
};

export const logout = async (instanceName: string) => {
  try {
    const response = await ApiInstance.delete(`/instance/logout/${instanceName}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.response || error;
  }
};

export const connect = async (instanceName: string, token: string) => {
  try {
    const response = await ApiInstance.get(`/instance/connect/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.response || error;
  }
};

export const checkStatus = async (instanceName: string, token: string) => {
  try {
    const response = await ApiInstance.get(`/instance/connectionState/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.response || error;
  }
};

export const settingsfind = async (instanceName: string, token: string) => {
  try {
    const response = await ApiInstance.get(`/settings/find/${instanceName}`, {
      headers: {
        apikey: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.response || error;
  }
};

export const updateSettings = async (instanceName: string, token: string, settings: any) => {
  try {
    const response = await ApiInstance.post(`/settings/set/${instanceName}`, settings, {
      headers: {
        apikey: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.response || error;
  }
};
