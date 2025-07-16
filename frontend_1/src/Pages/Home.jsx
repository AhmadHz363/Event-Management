// Layout.jsx
import React from "react";

import { Outlet } from "react-router-dom";

import Layout from "../Components/Layout/Layout";

const HomePage = () => {
  const token = localStorage.getItem("token");

  return token ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/" replace />
  );
};

export default HomePage;
