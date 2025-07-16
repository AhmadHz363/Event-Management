import React from "react";
import { Navbar, Container } from "react-bootstrap";
import { useSidebar } from "../../../Contexts/SidebarContext";
import { FiMenu, FiBell, FiSettings, FiHelpCircle } from "react-icons/fi";
import "./NavBar.css";

const AppNavbar = () => {
  const { toggleSidebar } = useSidebar();
  const admin = localStorage.getItem("admin")
    ? JSON.parse(localStorage.getItem("admin"))
    : null;

  return (
    <Navbar className="app-navbar">
      <Container fluid className="navbar-container">
        <div className="navbar-left">
          <button
            className="sidebar-toggler"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FiMenu className="menu-icon" />
          </button>
          <h1 className="app-title">Event Management Dashboard</h1>
        </div>

        <div className="navbar-right">
          <div className="user-profile">
            <div className="profile-image-container">
              <img
                src="/path-to-admin-image.jpg"
                alt="Admin"
                className="profile-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://ui-avatars.com/api/?name=Johan+Smith&background=random";
                }}
              />
            </div>
            <div className="profile-info">
              <span className="username"> {admin.username ?? "UnKnown"}</span>
              <span className="role">{admin.role ?? "unkown"}</span>
            </div>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
