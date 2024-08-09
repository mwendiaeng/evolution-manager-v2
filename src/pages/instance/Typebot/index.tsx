/* eslint-disable @typescript-eslint/no-explicit-any */
import "./style.css";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { useInstance } from "@/contexts/InstanceContext";
import { useEffect, useState } from "react";
import { Instance, Typebot as TypebotType } from "@/types/evolution.types";
import { useNavigate, useParams } from "react-router-dom";
import { findTypebot } from "@/services/typebot.service";
import { NewTypebot } from "./NewTypebot";
import { UpdateTypebot } from "./UpdateTypebot";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DefaultSettingsTypebot } from "./DefaultSettingsTypebot";
import { SessionsTypebot } from "./SessionsTypebot";

const fetchData = async (
  instance: Instance | null,
  setTypebots: any,
  setLoading: any
) => {
  try {
    const storedToken = localStorage.getItem("token");

    if (storedToken && instance && instance.name) {
      const data: TypebotType[] = await findTypebot(instance.name, storedToken);

      setTypebots(data);
    } else {
      console.error("Token ou nome da instância não encontrados.");
    }
    setLoading(false);
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
    setLoading(false);
  }
};

function Typebot() {
  const { instance } = useInstance();

  const { typebotId } = useParams<{ typebotId: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [typebots, setTypebots] = useState<TypebotType[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!instance) return;
    fetchData(instance, setTypebots, setLoading);
  }, [instance]);

  const handleBotClick = (botId: string) => {
    if (!instance) return;

    navigate(`/manager/instance/${instance.id}/typebot/${botId}`);
  };

  const resetTable = () => {
    fetchData(instance, setTypebots, setLoading);
  };

  return (
    <main className="main-table pt-5">
      <div className="flex items-center justify-between">
        <h3 className="ml-5 mb-1 text-lg font-medium">Typebots</h3>
        <div>
          <SessionsTypebot />
          <DefaultSettingsTypebot />
          <NewTypebot resetTable={resetTable} />
        </div>
      </div>
      <Separator className="mt-4 border border-black" />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} className="p-5">
          <div className="table">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                {typebots && typebots.length > 0 && Array.isArray(typebots) ? (
                  typebots.map((typebot) => (
                    <div
                      className={`table-item ${
                        typebot.id === typebotId ? "selected" : ""
                      }`}
                      onClick={() => handleBotClick(`${typebot.id}`)}
                    >
                      {typebot.description ? (
                        <>
                          <h3 className="table-item-title">
                            {typebot.description}
                          </h3>
                          <p className="table-item-description">
                            {typebot.url} - {typebot.typebot}
                          </p>
                        </>
                      ) : (
                        <>
                          <h3 className="table-item-title">{typebot.url}</h3>
                          <p className="table-item-description">
                            {typebot.typebot}
                          </p>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p>Nenhum typebot encontrado.</p>
                )}
              </>
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="border border-black" />
        <ResizablePanel className="">
          {typebotId && (
            <UpdateTypebot
              typebotId={typebotId}
              instance={instance}
              resetTable={resetTable}
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}

export { Typebot };
