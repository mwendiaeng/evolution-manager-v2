import { logout } from "@/services/auth.service";
import { fetchInstance } from "@/services/instances.service";
import { Instance } from "@/types/evolution.types";
import { DoorOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Header({ instanceId }: { instanceId?: string }) {
  const navigate = useNavigate();

  const handleClose = () => {
    logout();
    navigate("/manager/login");
  };

  const navigateToDashboard = () => {
    navigate("/manager/");
  };

  const [instance, setInstance] = useState<Instance | null>(null);

  useEffect(() => {
    if(instanceId){
      const fetchData = async (instanceId: string) => {
        try {
          const data = await fetchInstance(instanceId);
          setInstance(data[0] || null);
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      };
      
      fetchData(instanceId);
    }
  }, [instanceId]);

  return (
    <header>
      <a href="#" onClick={navigateToDashboard} className="header-logo">
        <img src="/assets/images/evolution-logo.png" alt="Logo" />
        <span className="header-title">Evolution Manager</span>
      </a>
      <div className="header-buttons">
        {instanceId && (
          <button className="profile-button">
            <img
              src={
                instance?.profilePicUrl || "/assets/images/evolution-logo.png"
              }
              alt="Perfil"
              className="profile-picture"
            />
          </button>
        )}
        <button onClick={handleClose} className="exit-button">
          <DoorOpen size="18" />
        </button>
      </div>
    </header>
  );
}

export { Header };
