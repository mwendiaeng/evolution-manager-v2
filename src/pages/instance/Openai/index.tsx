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
import { findOpenai } from "@/services/openai.service";
import { Instance, OpenaiBot } from "@/types/evolution.types";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateOpenai } from "./UpdateOpenai";
import { NewOpenai } from "./NewOpenai";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CredentialsOpenai } from "./CredentialsOpenai";
import { DefaultSettingsOpenai } from "./DefaultSettingsOpenai";
import { SessionsOpenai } from "./SessionsOpenai";

const fetchData = async (
  instance: Instance | null,
  setBots: any,
  setLoading: any
) => {
  try {
    const storedToken = localStorage.getItem("token");

    if (storedToken && instance && instance.name) {
      const data: OpenaiBot[] = await findOpenai(instance.name, storedToken);

      setBots(data);
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

  const navigate = useNavigate();

  useEffect(() => {
    if (!instance) return;
    fetchData(instance, setBots, setLoading);
  }, [instance]);

  const handleBotClick = (botId: string) => {
    if (!instance) return;

    navigate(`/manager/instance/${instance.id}/openai/${botId}`);
  };

  const resetTable = () => {
    fetchData(instance, setBots, setLoading);
  };

  return (
    <main className="main-table pt-5">
      <div className="flex items-center justify-between">
        <h3 className="ml-5 mb-1 text-lg font-medium">Openai Bots</h3>
        <div>
          <SessionsOpenai />
          <DefaultSettingsOpenai />
          <CredentialsOpenai />
          <NewOpenai resetTable={resetTable} />
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
                      <h3 className="table-item-title">
                        {bot.description || bot.id}
                      </h3>
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
