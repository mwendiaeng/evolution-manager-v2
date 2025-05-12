import { useQuery } from "@tanstack/react-query";

import { api } from "../api";
import { UseQueryParams } from "../types";
import { FindContactsResponse } from "./types";

interface IParams {
  instanceName: string;
}

const queryKey = (params: Partial<IParams>) => [
  "contacts",
  "findContacts",
  JSON.stringify(params),
];

export const findContacts = async ({ instanceName }: IParams) => {
  const response = await api.get(`/contact/findContacts/${instanceName}`);
  return response.data;
};

export const useFindContacts = (
  props: UseQueryParams<FindContactsResponse> & Partial<IParams>,
) => {
  const { instanceName, ...rest } = props;
  return useQuery<FindContactsResponse>({
    ...rest,
    queryKey: queryKey({ instanceName }),
    queryFn: () => findContacts({ instanceName: instanceName! }),
    enabled: !!instanceName,
  });
};
