import "./style.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchInstances } from "@/services/instances.service";
import { Instance } from "@/types/evolution.types";
import {
  Check,
  ChevronsUpDown,
  CircleUser,
  Cog,
  Copy,
  MessageCircle,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const fetchData = async (callback: (data: Instance[]) => void) => {
  try {
    const data = await fetchInstances();

    callback(data);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
};

function Dashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [instances, setInstances] = useState<Instance[]>([]);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleInstance =
    (instanceId: string): (() => void) =>
    () => {
      navigate(`/instance/${instanceId}/dashboard`);
    };

  useEffect(() => {
    const getData = async () => {
      await fetchData((result) => {
        setInstances(result);
      });
    };

    getData();
  }, []);

  const renderStatus = (status: string) => {
    switch (status) {
      case "open":
        return (
          <div className="btn connected">
            Conectada <span className="status-connected connected"></span>
          </div>
        );
      case "connecting":
        return (
          <div className="btn connected">
            Conectando <span className="status-connecting connected"></span>
          </div>
        );
      case "closed":
        return (
          <div className="btn connected">
            Desconectado <span className="status-disconnected connected"></span>
          </div>
        );
      default:
        return (
          <div className="btn connected">
            Desconectado <span className="status-disconnected connected"></span>
          </div>
        );
    }
  };

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-title">
          <h2>Instâncias</h2>
        </div>
        <div className="toolbar-buttons">
          <Button variant="outline" className="refresh-button">
            <RefreshCw />
          </Button>
          <Button variant="default" className="new-instance-button">
            <Plus /> Instância
          </Button>
        </div>
      </div>
      <div className="search">
        <div className="search-bar">
          <input type="text" placeholder="Pesquisar" />
        </div>
        <div className="status-dropdown">
          <button className="dropdown-button" onClick={toggleDropdown}>
            Status <ChevronsUpDown size="15" />
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item active">
                Todos
                <span>
                  <Check size="15" className="ml-2" />
                </span>
              </button>
              <button className="dropdown-item">Desconectado</button>
              <button className="dropdown-item">Conectando</button>
              <button className="dropdown-item">Conectado</button>
            </div>
          )}
        </div>
      </div>
      <main className="instance-cards">
        {instances.map((instance: Instance) => (
          <Card className="instance-card" key={instance.id}>
            <div className="card-header">
              <div className="card-id">
                <span>{instance.token}</span>
                <Copy className="card-icon" size="15" />
              </div>
              <div className="card-menu" onClick={handleInstance(instance.id)}>
                <Cog className="card-icon" size="20" />
              </div>
            </div>
            <div className="card-body">
              <div className="card-details">
                <p className="instance-name">{instance.name}</p>
                <p className="instance-description">{instance.profileName}</p>
              </div>
              <div className="card-contact">
                <p>{instance.ownerJid.split("@")[0]}</p>
              </div>
            </div>
            <div className="card-footer">
              <div className="card-stats">
                <div className="stat">
                  <CircleUser className="stat-icon" size="20" />
                  <span>0</span>
                </div>
                <div className="stat">
                  <MessageCircle className="stat-icon" size="20" />
                  <span>0</span>
                </div>
              </div>
              <div className="card-actions">
                {renderStatus(instance.connectionStatus)}
                <button className="btn disconnect">Deletar</button>
              </div>
            </div>
          </Card>
        ))}
      </main>
    </>
  );
}

export default Dashboard;
