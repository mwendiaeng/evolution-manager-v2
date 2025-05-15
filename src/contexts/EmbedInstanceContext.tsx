import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Instance } from "@/types/evolution.types";
import { TOKEN_ID } from "@/lib/queries/token";
import axios from "axios";

interface EmbedInstanceContextType {
  instance: Instance | null;
  isLoading: boolean;
  error: string | null;
}

const EmbedInstanceContext = createContext<EmbedInstanceContextType>({
  instance: null,
  isLoading: true,
  error: null,
});

export function EmbedInstanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchParams] = useSearchParams();
  const [instance, setInstance] = useState<Instance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateAndFetchInstance = async () => {
      const token = searchParams.get("token");
      const instanceName = searchParams.get("instanceName");

      if (!token || !instanceName) {
        setError("Token e instanceName são obrigatórios");
        setIsLoading(false);
        return;
      }

      try {
        const apiUrl = "https://lb.icommarketing.com.br";
        localStorage.setItem(TOKEN_ID.API_URL, apiUrl);
        localStorage.setItem(TOKEN_ID.INSTANCE_TOKEN, token);

        const { data } = await axios.get(
          `${apiUrl}/instance/fetchInstances?instanceName=${instanceName}`,
          {
            headers: {
              apikey: "fpsdv1DeD1SXg5Eb",
            },
          },
        );

        if (data && data?.instance) {
          setInstance(data.instance);
        } else {
          setError("Instância não encontrada");
        }
      } catch (err) {
        setError("Erro ao validar token ou buscar instância");
      } finally {
        setIsLoading(false);
      }
    };

    validateAndFetchInstance();
  }, [searchParams]);

  return (
    <EmbedInstanceContext.Provider value={{ instance, isLoading, error }}>
      {children}
    </EmbedInstanceContext.Provider>
  );
}

export const useEmbedInstance = () => useContext(EmbedInstanceContext);
