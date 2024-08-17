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

import { findDify } from "@/services/dify.service";

import { Dify as DifyType, Instance } from "@/types/evolution.types";

import { useMediaQuery } from "@/utils/useMediaQuery";

import { DefaultSettingsDify } from "./DefaultSettingsDify";
import { NewDify } from "./NewDify";
import { SessionsDify } from "./SessionsDify";
import { UpdateDify } from "./UpdateDify";

const fetchData = async (
  instance: Instance | null,
  setBots: any,
  setLoading: any,
) => {
  try {
    const storedToken = localStorage.getItem("token");

    if (storedToken && instance && instance.name) {
      const data: DifyType[] = await findDify(instance.name, storedToken);

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

function Dify() {
  const isMD = useMediaQuery("(min-width: 768px)");
  const { instance } = useInstance();

  const { difyId } = useParams<{ difyId: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [bots, setBots] = useState<DifyType[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!instance) return;
    fetchData(instance, setBots, setLoading);
  }, [instance]);

  const handleBotClick = (botId: string) => {
    if (!instance) return;

    navigate(`/manager/instance/${instance.id}/dify/${botId}`);
  };

  const resetTable = () => {
    fetchData(instance, setBots, setLoading);
  };

  return (
    <main className="pt-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-lg font-medium">Dify Bots</h3>
        <div className="flex items-center justify-end gap-2">
          <SessionsDify />
          <DefaultSettingsDify />
          <NewDify resetTable={resetTable} />
        </div>
      </div>
      <Separator className="my-4" />
      <ResizablePanelGroup direction={isMD ? "horizontal" : "vertical"}>
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
                      variant={difyId === bot.id ? "secondary" : "outline"}
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
        {difyId && (
          <>
            <ResizableHandle withHandle className="border border-border" />
            <ResizablePanel className="">
              <UpdateDify
                difyId={difyId}
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

export { Dify };
