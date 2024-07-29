/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import Menus from "./constants/menus";

import { useInstance } from "@/contexts/InstanceContext";

function Sidebar() {
  const navigate = useNavigate();

  const { instance } = useInstance();

  const handleNavigate = (menu?: any) => {
    if (!menu || !instance) return;

    if (menu.path) navigate(`/instance/${instance.id}/${menu.path}`);
    if (menu.link) window.open(menu.link, "_blank");
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
                onClick={() => handleNavigate(menu)}
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
