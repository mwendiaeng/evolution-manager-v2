import { useNavigate } from "react-router-dom";
import Menus from "./constants/menus";

type SidebarProps = {
  instanceId: string;
};

function Sidebar({ instanceId }: SidebarProps) {
  const navigate = useNavigate();

  const handleNavigate = (path?: string) => {
    if (!path) return;

    navigate(`/instance/${instanceId}/${path}`);
  };

  return (
    <menu className="sidebar">
      <ul className="sidebar-nav">
        {Menus.map((menu) => {
          const path = window.location.pathname.split("/")[3];

          let active = false;
          if (menu.path === path) {
            active = true;
          } else {
            active = false;
          }

          return (
            <li key={menu.id} className="nav-item">
              <button
                onClick={() => handleNavigate(menu.path)}
                className={active ? "active" : ""}
              >
                {menu.icon ? (
                  <>
                    <menu.icon className="nav-icon" size="15" />
                    <span className="nav-title">{menu.title}</span>
                  </>
                ) : (
                  <span className="nav-label">{menu.title}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </menu>
  );
}

export { Sidebar };
