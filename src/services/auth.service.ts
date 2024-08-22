import axios from "axios";

import { saveToken } from "@/lib/queries/token";

export const verifyServer = async (url: string) => {
  const response = await axios.get(`${url}/`);
  return response.data;
};

export const verifyCreds = async (url: string, token: string) => {
  try {
    const response = await axios.post(
      `${url}/verify-creds`,
      {},
      { headers: { apikey: token } },
    );

    const { data } = response;

    console.log(data);

    saveToken({
      facebookAppId: data.facebookAppId,
      facebookConfigId: data.facebookConfigId,
      facebookUserToken: data.facebookUserToken,
    });

    return data;
  } catch (error) {
    return null;
  }
};
