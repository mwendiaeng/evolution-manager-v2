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

import { getToken, TOKEN_ID } from "@/lib/queries/token";

import { findFlowise } from "@/services/flowise.service";

import { Flowise as FlowiseType, Instance } from "@/types/evolution.types";

import { useMediaQuery } from "@/utils/useMediaQuery";

import { DefaultSettingsFlowise } from "./DefaultSettingsFlowise";
import { NewFlowise } from "./NewFlowise";
import { SessionsFlowise } from "./SessionsFlowise";
import { UpdateFlowise } from "./UpdateFlowise";

const fetchData = async (
  instance: Instance | null,
  setBots: any,
  setLoading: any,
) => {
  try {
    const storedToken = getToken(TOKEN_ID.TOKEN);

    if (storedToken && instance && instance.name) {
      const data: FlowiseType[] = await findFlowise(instance.name, storedToken);

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

function Flowise() {
  const { t } = useTranslation();
  const isMD = useMediaQuery("(min-width: 768px)");
  const { instance } = useInstance();

  const { flowiseId } = useParams<{ flowiseId: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [bots, setBots] = useState<FlowiseType[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!instance) return;
    fetchData(instance, setBots, setLoading);
  }, [instance]);

  const handleBotClick = (botId: string) => {
    if (!instance) return;

    navigate(`/manager/instance/${instance.id}/flowise/${botId}`);
  };

  const resetTable = () => {
    fetchData(instance, setBots, setLoading);
  };

  return (
    <main className="pt-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-lg font-medium">{t("flowise.title")}</h3>
        <div className="flex items-center justify-end gap-2">
          <SessionsFlowise />
          <DefaultSettingsFlowise />
          <NewFlowise resetTable={resetTable} />
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
                      variant={flowiseId === bot.id ? "secondary" : "outline"}
                    >
                      <h4 className="text-base">{bot.description || bot.id}</h4>
                    </Button>
                  ))
                ) : (
                  <Button variant="link">{t("flowise.table.none")}</Button>
                )}
              </>
            )}
          </div>
        </ResizablePanel>
        {flowiseId && (
          <>
            <ResizableHandle withHandle className="border border-border" />
            <ResizablePanel className="">
              <UpdateFlowise flowiseId={flowiseId} resetTable={resetTable} />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </main>
  );
}

export { Flowise };
