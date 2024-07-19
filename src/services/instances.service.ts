import ApiInstance from "@/utils/instance";

export const fetchInstances = async () => {
  const response = await ApiInstance.get("/instance/fetchInstances");
  return response.data;
};

export const fetchInstance = async (instanceId: string) => {
    const response = await ApiInstance.get(`/instance/fetchInstances?instanceId=${instanceId}`);
    return response.data;
}
