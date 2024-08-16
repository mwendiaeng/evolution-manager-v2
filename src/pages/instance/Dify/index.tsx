/* eslint-disable @typescript-eslint/no-explicit-any */
import "./style.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    <main className="main-table pt-5">
      <div className="flex items-center justify-between">
        <h3 className="mb-1 ml-5 text-lg font-medium">Dify Bots</h3>
        <div>
          <SessionsDify />
          <DefaultSettingsDify />
          <NewDify resetTable={resetTable} />
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
                      key={bot.id ?? bot.apiKey}
                      className={`table-item ${
                        bot.id === difyId ? "selected" : ""
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
          {difyId && (
            <UpdateDify
              difyId={difyId}
              instance={instance}
              resetTable={resetTable}
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}

export { Dify };
