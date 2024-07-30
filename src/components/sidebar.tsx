/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import Menus from "./constants/menus";

import { useInstance } from "@/contexts/InstanceContext";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

function Sidebar() {
  const navigate = useNavigate();

  const { instance } = useInstance();

  const handleNavigate = (menu?: any) => {
    if (!menu || !instance) return;

    if (menu.path) navigate(`/manager/instance/${instance.id}/${menu.path}`);
    if (menu.link) window.open(menu.link, "_blank");
  };

  return (
    <menu className="sidebar">
      <ul className="sidebar-nav">
        {Menus.map((menu) => {
          const path = window.location.pathname;

          let active = false;
          if (menu.path && path.includes(menu.path)) {
            active = true;
          } else {
            active = false;
          }

          return (
            <li key={menu.id} className="nav-item">
              {menu.children ? (
                <Collapsible>
                  <CollapsibleTrigger>
                    {menu.icon ? (
                      <>
                        <menu.icon className="nav-icon" size="15" />
                        <span className="nav-title">{menu.title}</span>
                      </>
                    ) : (
                      <span className="nav-label">{menu.title}</span>
                    )}
                    {menu.children && (
                      <span className="nav-arrow">
                        <ChevronDown size="15" />
                      </span>
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="sidebar-nav">
                      {menu.children.map((child: any) => {
                        const path = window.location.pathname;

                        let active = false;
                        if (child.path && path.includes(child.path)) {
                          active = true;
                        } else {
                          active = false;
                        }

                        return (
                          <li key={child.id} className="nav-item">
                            <button
                              onClick={() => handleNavigate(child)}
                              className={active ? "active" : ""}
                            >
                              {child.icon ? (
                                <>
                                  <child.icon className="nav-icon" size="15" />
                                  <span className="nav-title">
                                    {child.title}
                                  </span>
                                </>
                              ) : (
                                <span className="nav-label">{child.title}</span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
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
              )}
            </li>
          );
        })}
      </ul>
    </menu>
  );
}

export { Sidebar };
