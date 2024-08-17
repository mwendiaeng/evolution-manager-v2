/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";

import { useInstance } from "@/contexts/InstanceContext";

import { findOpenai } from "@/services/openai.service";

import { Instance, OpenaiBot } from "@/types/evolution.types";

import { CredentialsOpenai } from "./CredentialsOpenai";
import { DefaultSettingsOpenai } from "./DefaultSettingsOpenai";
import { NewOpenai } from "./NewOpenai";
import { SessionsOpenai } from "./SessionsOpenai";
import { UpdateOpenai } from "./UpdateOpenai";

const fetchData = async (
  instance: Instance | null,
  setBots: any,
  setLoading: any,
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
    <main className="pt-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-lg font-medium">Openai Bots</h3>
        <div className="flex items-center justify-end gap-2">
          <SessionsOpenai />
          <DefaultSettingsOpenai />
          <CredentialsOpenai />
          <NewOpenai resetTable={resetTable} />
        </div>
      </div>
      <Separator className="my-4" />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} className="pr-4">
          <div className="flex flex-col gap-3">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                {bots && bots.length > 0 && Array.isArray(bots) ? (
                  bots.map((bot) => (
                    <Button
                      className="flex h-auto flex-col items-start justify-start"
                      key={bot.id}
                      onClick={() => handleBotClick(`${bot.id}`)}
                      variant={openaiBotId === bot.id ? "secondary" : "outline"}
                    >
                      <h4 className="text-base">{bot.description || bot.id}</h4>
                      <p className="text-sm font-normal text-muted-foreground">
                        {bot.botType}
                      </p>
                    </Button>
                  ))
                ) : (
                  <Button variant="link">Nenhum bot encontrado.</Button>
                )}
              </>
            )}
          </div>
        </ResizablePanel>
        {openaiBotId && (
          <>
            <ResizableHandle withHandle className="border border-border" />
            <ResizablePanel className="">
              <UpdateOpenai
                openaiBotId={openaiBotId}
                instance={instance}
                resetTable={resetTable}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </main>
  );
}

export { Openai };
