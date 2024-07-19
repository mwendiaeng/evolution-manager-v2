import "./style.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleInstance = () => {
    navigate("/instance/ya2o5deerwayme8sq20b2/dashboard");
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
        <Card className="instance-card">
          <div className="card-header">
            <div className="card-id">
              <span>ya2o5deerwayme8sq20b2</span>
              <Copy className="card-icon" size="15" />
            </div>
            <div className="card-menu" onClick={handleInstance}>
              <Cog className="card-icon" size="20" />
            </div>
          </div>
          <div className="card-body">
            <div className="card-details">
              <p className="instance-name">Instance Name</p>
              <p className="instance-description">Contact Name</p>
            </div>
            <div className="card-contact">
              <p>+55 11 123456789</p>
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
              <div className="btn connected">
                Conectada <span className="status-connected connected"></span>
              </div>
              <button className="btn disconnect">Desconectar</button>
            </div>
          </div>
        </Card>
        <Card className="instance-card">
          <div className="card-header">
            <div className="card-id">
              <span>ya2o5deerwayme8sq20b2</span>
              <Copy className="card-icon" size="15" />
            </div>
            <div className="card-menu" onClick={handleInstance}>
              <Cog className="card-icon" size="20" />
            </div>
          </div>
          <div className="card-body">
            <div className="card-details">
              <p className="instance-name">Instance Name</p>
              <p className="instance-description">Contact Name</p>
            </div>
            <div className="card-contact">
              <p>+55 11 123456789</p>
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
              <div className="btn connected">
                Conectando{" "}
                <span className="status-connecting connecting"></span>
              </div>
              <button className="btn disconnect">Desconectar</button>
            </div>
          </div>
        </Card>
        <Card className="instance-card">
          <div className="card-header">
            <div className="card-id">
              <span>ya2o5deerwayme8sq20b2</span>
              <Copy className="card-icon" size="15" />
            </div>
            <div className="card-menu" onClick={handleInstance}>
              <Cog className="card-icon" size="20" />
            </div>
          </div>
          <div className="card-body">
            <div className="card-details">
              <p className="instance-name">Instance Name</p>
              <p className="instance-description">Contact Name</p>
            </div>
            <div className="card-contact">
              <p>+55 11 123456789</p>
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
              <div className="btn connected">
                Desconectada{" "}
                <span className="status-disconnected connected"></span>
              </div>
              <button className="btn disconnect">Desconectar</button>
            </div>
          </div>
        </Card>
        <Card className="instance-card">
          <div className="card-header">
            <div className="card-id">
              <span>ya2o5deerwayme8sq20b2</span>
              <Copy className="card-icon" size="15" />
            </div>
            <div className="card-menu" onClick={handleInstance}>
              <Cog className="card-icon" size="20" />
            </div>
          </div>
          <div className="card-body">
            <div className="card-details">
              <p className="instance-name">Instance Name</p>
              <p className="instance-description">Contact Name</p>
            </div>
            <div className="card-contact">
              <p>+55 11 123456789</p>
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
              <div className="btn connected">
                Conectada <span className="status-connected connected"></span>
              </div>
              <button className="btn disconnect">Desconectar</button>
            </div>
          </div>
        </Card>
        <Card className="instance-card">
          <div className="card-header">
            <div className="card-id">
              <span>ya2o5deerwayme8sq20b2</span>
              <Copy className="card-icon" size="15" />
            </div>
            <div className="card-menu" onClick={handleInstance}>
              <Cog className="card-icon" size="20" />
            </div>
          </div>
          <div className="card-body">
            <div className="card-details">
              <p className="instance-name">Instance Name</p>
              <p className="instance-description">Contact Name</p>
            </div>
            <div className="card-contact">
              <p>+55 11 123456789</p>
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
              <div className="btn connected">
                Conectada <span className="status-connected connected"></span>
              </div>
              <button className="btn disconnect">Desconectar</button>
            </div>
          </div>
        </Card>
        <Card className="instance-card">
          <div className="card-header">
            <div className="card-id">
              <span>ya2o5deerwayme8sq20b2</span>
              <Copy className="card-icon" size="15" />
            </div>
            <div className="card-menu" onClick={handleInstance}>
              <Cog className="card-icon" size="20" />
            </div>
          </div>
          <div className="card-body">
            <div className="card-details">
              <p className="instance-name">Instance Name</p>
              <p className="instance-description">Contact Name</p>
            </div>
            <div className="card-contact">
              <p>+55 11 123456789</p>
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
              <div className="btn connected">
                Conectada <span className="status-connected connected"></span>
              </div>
              <button className="btn disconnect">Desconectar</button>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}

export default Dashboard;
