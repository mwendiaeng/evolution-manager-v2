import "./style.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  deleteInstance,
  fetchInstances,
  logout,
} from "@/services/instances.service";
import { Instance } from "@/types/evolution.types";
import {
  Check,
  ChevronsUpDown,
  CircleUser,
  Cog,
  Copy,
  Eye,
  EyeOff,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewInstance } from "./NewInstance";
import toastService from "@/utils/custom-toast.service";
import { copyToClipboard } from "@/utils/copy-to-clipboard";

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
  const [deleting, setDeleting] = useState<string[]>([]);
  const [visible, setVisible] = useState<string[]>([]);
  const [searchStatus, setSearchStatus] = useState<string>("all");

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleInstance =
    (instanceName: string): (() => void) =>
    () => {
      navigate(`/instance/${instanceName}/dashboard`);
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

  const resetTable = async () => {
    await fetchData((result) => {
      setInstances(result);
    });
  };

  const handleDelete = async (instanceName: string) => {
    setDeleting([...deleting, instanceName]);
    try {
      try {
        await logout(instanceName);
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
      }
      await deleteInstance(instanceName);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      resetTable();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao deletar instância:", error);
      toastService.error(
        `Erro ao deletar : ${error?.response?.data?.response?.message}`
      );
    } finally {
      setDeleting(deleting.filter((item) => item !== instanceName));
    }
  };

  const searchByName = async (name: string) => {
    if (name === "") {
      await resetTable();
      return;
    }

    const data = instances.filter((instance) => {
      return instance.name.toLowerCase().includes(name.toLowerCase());
    });
    setInstances(data);
  };

  const searchByStatus = async (status: string) => {
    setSearchStatus(status);
    if (status === "all") {
      await resetTable();
      return;
    }

    await fetchData((result) => {
      const data = result.filter((instance) => {
        return instance.connectionStatus === status;
      });
      setInstances(data);
    });
  };

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-title">
          <h2>Instâncias</h2>
        </div>
        <div className="toolbar-buttons">
          <Button variant="outline" className="refresh-button">
            <RefreshCw onClick={resetTable} size="20" />
          </Button>
          <NewInstance resetTable={resetTable} />
        </div>
      </div>
      <div className="search">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Pesquisar"
            onChange={(e) => searchByName(e.target.value)}
          />
        </div>
        <div className="status-dropdown">
          <button className="dropdown-button" onClick={toggleDropdown}>
            Status <ChevronsUpDown size="15" />
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button
                className={`dropdown-item ${
                  searchStatus === "all" ? "active" : ""
                }`}
                onClick={() => searchByStatus("all")}
              >
                Todos
                {searchStatus === "all" && (
                  <span>
                    <Check size="15" className="ml-2" />
                  </span>
                )}
              </button>
              <button
                onClick={() => searchByStatus("close")}
                className={`dropdown-item ${
                  searchStatus === "close" ? "active" : ""
                }`}
              >
                Desconectado
                {searchStatus === "close" && (
                  <span>
                    <Check size="15" className="ml-2" />
                  </span>
                )}
              </button>
              <button
                onClick={() => searchByStatus("connecting")}
                className={`dropdown-item ${
                  searchStatus === "connecting" ? "active" : ""
                }`}
              >
                Conectando
                {searchStatus === "connecting" && (
                  <span>
                    <Check size="15" className="ml-2" />
                  </span>
                )}
              </button>
              <button
                onClick={() => searchByStatus("open")}
                className={`dropdown-item ${
                  searchStatus === "open" ? "active" : ""
                }`}
              >
                Conectado
                {searchStatus === "open" && (
                  <span>
                    <Check size="15" className="ml-2" />
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      <main className="instance-cards">
        {instances.map((instance: Instance) => (
          <Card className="instance-card" key={instance.id}>
            <div className="card-header">
              <div className="card-id">
                <span>
                  {visible.includes(instance.token)
                    ? instance.token.substring(0, 36) + "..."
                    : instance.token
                        .substring(0, 36)
                        .split("")
                        .map(() => "*")
                        .join("")}
                </span>
                <Copy
                  className="card-icon"
                  size="15"
                  onClick={() => {
                    copyToClipboard(instance.token);
                  }}
                />
                {visible.includes(instance.token) ? (
                  <EyeOff
                    className="card-icon"
                    size="15"
                    onClick={() => {
                      setVisible(
                        visible.filter((item) => item !== instance.token)
                      );
                    }}
                  />
                ) : (
                  <Eye
                    className="card-icon"
                    size="15"
                    onClick={() => {
                      setVisible([...visible, instance.token]);
                    }}
                  />
                )}
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
                <p>{instance.ownerJid && instance.ownerJid.split("@")[0]}</p>
              </div>
            </div>
            <div className="card-footer">
              <div className="card-stats">
                <div className="stat">
                  <CircleUser className="stat-icon" size="20" />
                  <span>{instance?._count?.Contact || 0}</span>
                </div>
                <div className="stat">
                  <MessageCircle className="stat-icon" size="20" />
                  <span>{instance?._count?.Message || 0}</span>
                </div>
              </div>
              <div className="card-actions">
                {renderStatus(instance.connectionStatus)}
                <button
                  className={`btn disconnect ${
                    deleting.includes(instance.name) ? "disabled" : ""
                  }`}
                  onClick={() => handleDelete(instance.name)}
                  disabled={deleting.includes(instance.name)}
                >
                  {deleting.includes(instance.name) ? (
                    <span>Deletando...</span>
                  ) : (
                    <span>Deletar</span>
                  )}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </main>
    </>
  );
}

export default Dashboard;
