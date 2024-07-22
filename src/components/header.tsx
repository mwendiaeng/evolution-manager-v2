import { logout } from "@/services/auth.service";
import { DoorOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  perfil?: boolean;
};

function Header({ perfil }: HeaderProps) {
  const navigate = useNavigate();

  const handleClose = () => {
    logout();
    navigate("/login");
  };

  const navigateToDashboard = () => {
    navigate("/");
  };

  return (
    <header>
      <div className="header-logo">
        <a href="#" onClick={navigateToDashboard}>
          <img src="/assets/images/evolution-logo.png" alt="Logo" />
        </a>
        <span className="header-title">Evolution Manager</span>
      </div>
      <div className="header-buttons">
        {perfil && (
          <button className="profile-button">
            <img
              src="/assets/images/evolution-logo.png"
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
