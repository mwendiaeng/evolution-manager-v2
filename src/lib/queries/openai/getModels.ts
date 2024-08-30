import { useQuery } from "@tanstack/react-query";

import { api } from "../api";
import { UseQueryParams } from "../types";
import { GetModelsResponse } from "./types";

interface IParams {
  instanceName: string;
  token?: string | null;
}

const queryKey = (params: Partial<IParams>) => [
  "openai",
  "getModels",
  JSON.stringify(params),
];

export const getModels = async ({ instanceName, token }: IParams) => {
  const response = await api.get(`/openai/getModels/${instanceName}`, {
    headers: { apiKey: token },
  });
  return response.data;
};

export const useGetModels = (
  props: UseQueryParams<GetModelsResponse> & Partial<IParams>,
) => {
  const { instanceName, token, ...rest } = props;
  return useQuery<GetModelsResponse>({
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
    ...rest,
    queryKey: queryKey({ instanceName }),
    queryFn: () =>
      getModels({
        instanceName: instanceName!,
        token,
      }),
    enabled: !!instanceName && (props.enabled ?? true),
  });
};
