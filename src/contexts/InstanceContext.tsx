import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useParams } from "react-router-dom";
import { Instance } from "@/types/evolution.types";
import { fetchInstance } from "@/services/instances.service";

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
  const { instanceId } = useParams<{ instanceId: string }>();
  const [instance, setInstance] = useState<Instance | null>(null);

  useEffect(() => {
    const fetchData = async (instanceId: string) => {
      try {
        const data = await fetchInstance(instanceId);
        setInstance(data[0] || null);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    if (instanceId) {
      fetchData(instanceId);
    }
  }, [instanceId]);

  return (
    <InstanceContext.Provider value={{ instance }}>
      {children}
    </InstanceContext.Provider>
  );
};