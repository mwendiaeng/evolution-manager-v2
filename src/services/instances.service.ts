import ApiInstance from "@/utils/instance";

export const fetchInstances = async () => {
  const response = await ApiInstance.get("/instance/fetchInstances");
  return response.data;
};
