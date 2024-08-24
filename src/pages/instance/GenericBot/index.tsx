/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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

import { findGenericBot } from "@/services/genericBot.service";

import {
  GenericBot as GenericBotType,
  Instance,
} from "@/types/evolution.types";

import { useMediaQuery } from "@/utils/useMediaQuery";

import { DefaultSettingsGenericBot } from "./DefaultSettingsGenericBot";
import { NewGenericBot } from "./NewGenericBot";
import { SessionsGenericBot } from "./SessionsGenericBot";
import { UpdateGenericBot } from "./UpdateGenericBot";

const fetchData = async (
  instance: Instance | null,
  setBots: any,
  setLoading: any,
) => {
  try {
    const storedToken = localStorage.getItem("token");

    if (storedToken && instance && instance.name) {
      const data: GenericBotType[] = await findGenericBot(
        instance.name,
        storedToken,
      );

      setBots(data);
    } else {
      console.error("Token not found");
    }
    setLoading(false);
  } catch (error) {
    console.error("Error:", error);
    setLoading(false);
  }
};

function GenericBot() {
  const { t } = useTranslation();
  const isMD = useMediaQuery("(min-width: 768px)");
  const { instance } = useInstance();

  const { genericBotId } = useParams<{ genericBotId: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [bots, setBots] = useState<GenericBotType[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!instance) return;
    fetchData(instance, setBots, setLoading);
  }, [instance]);

  const handleBotClick = (botId: string) => {
    if (!instance) return;

    navigate(`/manager/instance/${instance.id}/generic/${botId}`);
  };

  const resetTable = () => {
    fetchData(instance, setBots, setLoading);
  };

  return (
    <main className="pt-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-lg font-medium">{t("genericBot.title")}</h3>
        <div className="flex items-center justify-end gap-2">
          <SessionsGenericBot />
          <DefaultSettingsGenericBot />
          <NewGenericBot resetTable={resetTable} />
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
                      variant={
                        genericBotId === bot.id ? "secondary" : "outline"
                      }
                    >
                      <h4 className="text-base">{bot.description || bot.id}</h4>
                    </Button>
                  ))
                ) : (
                  <Button variant="link">{t("genericBot.table.none")}</Button>
                )}
              </>
            )}
          </div>
        </ResizablePanel>
        {genericBotId && (
          <>
            <ResizableHandle withHandle className="border border-border" />
            <ResizablePanel className="">
              <UpdateGenericBot
                genericBotId={genericBotId}
                resetTable={resetTable}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </main>
  );
}

export { GenericBot };
