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
import { findOpenai, findOpenaiCreds } from "@/services/openai.service";
import { Instance, OpenaiBot, OpenaiCreds } from "@/types/evolution.types";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateOpenai } from "./UpdateOpenai";
import { NewOpenai } from "./NewOpenai";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CredentialsOpenai } from "./CredentialsOpenai";
import { DefaultSettingsOpenai } from "./DefaultSettingsOpenai";

const fetchData = async (
  instance: Instance | null,
  setBots: any,
  setCreds: any,
  setLoading: any
) => {
  try {
    const storedToken = localStorage.getItem("token");

    if (storedToken && instance && instance.name) {
      const data: OpenaiBot[] = await findOpenai(instance.name, storedToken);

      setBots(data);

      const getCreds: OpenaiCreds[] = await findOpenaiCreds(
        instance.name,
        storedToken
      );

      setCreds(getCreds);
    } else {
      console.error("Token ou nome da instância não encontrados.");
    }
    setLoading(false);
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
    setLoading(false);
  }
};

function Openai() {
  const { instance } = useInstance();

  const { openaiBotId } = useParams<{ openaiBotId: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [bots, setBots] = useState<OpenaiBot[]>([]);
  const [creds, setCreds] = useState<OpenaiCreds[] | []>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData(instance, setBots, setCreds, setLoading);
  }, [instance]);

  const handleBotClick = (botId: string) => {
    if (!instance) return;

    navigate(`/manager/instance/${instance.id}/openai/${botId}`);
  };

  const resetTable = () => {
    fetchData(instance, setBots, setCreds, setLoading);
  };

  return (
    <main className="main-table pt-5">
      <div className="flex items-center justify-between">
        <h3 className="ml-5 mb-1 text-lg font-medium">Openai Bots</h3>
        <div>
          <DefaultSettingsOpenai creds={creds} />
          <CredentialsOpenai />
          <NewOpenai resetTable={resetTable} creds={creds} />
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
                {bots && bots.length > 0 && Array.isArray(bots) ? (
                  bots.map((bot) => (
                    <div
                      className={`table-item ${
                        bot.id === openaiBotId ? "selected" : ""
                      }`}
                      onClick={() => handleBotClick(`${bot.id}`)}
                    >
                      <h3 className="table-item-title">{bot.id}</h3>
                      <p className="table-item-description">{bot.botType}</p>
                    </div>
                  ))
                ) : (
                  <p>Nenhum bot encontrado.</p>
                )}
              </>
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="border border-black" />
        <ResizablePanel className="">
          {openaiBotId && (
            <UpdateOpenai
              creds={creds}
              openaiBotId={openaiBotId}
              instance={instance}
              resetTable={resetTable}
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}

export { Openai };
