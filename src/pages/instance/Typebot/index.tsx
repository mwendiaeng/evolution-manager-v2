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

import { findTypebot } from "@/services/typebot.service";

import { Instance, Typebot as TypebotType } from "@/types/evolution.types";

import { useMediaQuery } from "@/utils/useMediaQuery";

import { DefaultSettingsTypebot } from "./DefaultSettingsTypebot";
import { NewTypebot } from "./NewTypebot";
import { SessionsTypebot } from "./SessionsTypebot";
import { UpdateTypebot } from "./UpdateTypebot";

const fetchData = async (
  instance: Instance | null,
  setTypebots: any,
  setLoading: any,
) => {
  try {
    const storedToken = localStorage.getItem("token");

    if (storedToken && instance && instance.name) {
      const data: TypebotType[] = await findTypebot(instance.name, storedToken);

      setTypebots(data);
    } else {
      console.error("token not found.");
    }
    setLoading(false);
  } catch (error) {
    console.error("Error", error);
    setLoading(false);
  }
};

function Typebot() {
  const { t } = useTranslation();
  const isMD = useMediaQuery("(min-width: 768px)");
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
    <main className="pt-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-lg font-medium">{t("typebot.title")}</h3>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <SessionsTypebot />
          <DefaultSettingsTypebot />
          <NewTypebot resetTable={resetTable} />
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
                {typebots && typebots.length > 0 && Array.isArray(typebots) ? (
                  typebots.map((bot) => (
                    <Button
                      className="flex h-auto flex-col items-start justify-start"
                      key={bot.id}
                      onClick={() => handleBotClick(`${bot.id}`)}
                      variant={typebotId === bot.id ? "secondary" : "outline"}
                    >
                      {bot.description ? (
                        <>
                          <h4 className="text-base">{bot.description}</h4>
                          <p className="text-wrap text-sm font-normal text-muted-foreground">
                            {bot.url} - {bot.typebot}
                          </p>
                        </>
                      ) : (
                        <>
                          <h4 className="text-base">{bot.url}</h4>
                          <p className="text-wrap text-sm font-normal text-muted-foreground">
                            {bot.typebot}
                          </p>
                        </>
                      )}
                    </Button>
                  ))
                ) : (
                  <Button variant="link">{t("typebot.table.none")}</Button>
                )}
              </>
            )}
          </div>
        </ResizablePanel>
        {typebotId && (
          <>
            <ResizableHandle withHandle className="border border-black" />
            <ResizablePanel className="">
              <UpdateTypebot typebotId={typebotId} resetTable={resetTable} />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </main>
  );
}

export { Typebot };
