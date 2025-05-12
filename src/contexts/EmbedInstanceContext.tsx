import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { apiGlobal } from "@/lib/queries/api";

import { Instance } from "@/types/evolution.types";

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
        const { data } = await apiGlobal.get(`/instance/fetchInstances`, {
          params: { instanceName },
        });

        if (data && data.instance) {
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
