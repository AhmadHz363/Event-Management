import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSidebar } from "../../../Contexts/SidebarContext";
import {
  FiHome,
  FiUsers,
  FiUserPlus,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiCalendar,
  FiBarChart2,
  FiFileText,
  FiList,
  FiLayers,
  FiPlusCircle,
  FiEdit,
  FiBookOpen,
  FiPlusSquare,
  FiTag,
  FiShield,
  FiPhoneOutgoing,
} from "react-icons/fi";
import "./Sidebar.css";
import { useAuth } from "../../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// inside component

const AppSidebar = () => {
  const { isSidebarOpen } = useSidebar();
  const [openMenus, setOpenMenus] = useState({});
  const { logout } = useAuth();
  const navigate = useNavigate();
  const admin = localStorage.getItem("admin")
    ? JSON.parse(localStorage.getItem("admin"))
    : null;

  const toggleSubMenu = (menuText) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuText]: !prev[menuText],
    }));
  };

  const navItems = [
    { to: "/dashboard", icon: <FiHome size={20} />, text: "Dashboard" },

    {
      icon: <FiUsers size={20} />,
      text: "Events",
      children: [
        {
          to: "/Events",
          text: "All Events",
          icon: <FiList size={18} />,
        },
      ],
    },
  ];

  return (
    <aside className={`app-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        {isSidebarOpen && <h3 className="sidebar-title">Admin Panel</h3>}
      </div>

      <Nav className="sidebar-nav">
        {navItems.map((item) => {
          if (item.children) {
            return (
              <div key={item.text} className="nav-group">
                <div
                  className={`nav-parent ${openMenus[item.text] ? "open" : ""}`}
                  onClick={() => toggleSubMenu(item.text)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {isSidebarOpen && (
                    <>
                      <span className="nav-text">{item.text}</span>
                      <span className="submenu-toggle">
                        {openMenus[item.text] ? (
                          <FiChevronDown size={16} />
                        ) : (
                          <FiChevronRight size={16} />
                        )}
                      </span>
                    </>
                  )}
                </div>

                {openMenus[item.text] && (
                  <div className="submenu">
                    {item.children.map((sub) => (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        className={({ isActive }) =>
                          `sub-link ${isActive ? "active" : ""}`
                        }
                      >
                        <span className="sub-icon">{sub.icon}</span>
                        {isSidebarOpen && (
                          <span className="sub-text">{sub.text}</span>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                {isSidebarOpen && <span className="nav-text">{item.text}</span>}
              </NavLink>
            );
          }
        })}
      </Nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={() => logout(navigate)}>
          <FiLogOut className="logout-icon" size={20} />
          {isSidebarOpen && <span className="logout-text">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
