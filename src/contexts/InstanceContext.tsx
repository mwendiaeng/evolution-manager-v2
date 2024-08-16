/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useParams } from "react-router-dom";

import { fetchInstance } from "@/services/instances.service";

import { Instance } from "@/types/evolution.types";

interface InstanceContextProps {
  instance: Instance | null;
}

export const InstanceContext = createContext<InstanceContextProps | null>(null);

export const useInstance = () => {
  const context = useContext(InstanceContext);
  if (!context) {
    throw new Error("useInstance must be used within an InstanceProvider");
  }
  return context;
};

interface InstanceProviderProps {
  children: ReactNode;
}

export const InstanceProvider: React.FC<InstanceProviderProps> = ({
  children,
}): React.ReactNode => {
  const queryParams = useParams<{ instanceId: string }>();
  const [instanceId, setInstanceId] = useState<string | null>(null);
  const [instance, setInstance] = useState<Instance | null>(null);

  useEffect(() => {
    if (queryParams.instanceId) {
      setInstanceId(queryParams.instanceId);
    } else {
      setInstanceId(null);
    }
  }, [queryParams]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async (instanceId: string) => {
      try {
        const data = await fetchInstance(instanceId, abortController.signal);
        setInstance(data[0] || null);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    if (instanceId) {
      fetchData(instanceId);
    }
    return () => {
      abortController.abort();
    };
  }, [instanceId]);

  return (
    <InstanceContext.Provider value={{ instance }}>
      {children}
    </InstanceContext.Provider>
  );
};
