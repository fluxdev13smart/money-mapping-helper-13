
import React from "react";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import Advertisement from "@/components/Advertisement";
import { useAuth } from "@/contexts/AuthContext";

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      {isAuthenticated ? <Dashboard /> : <Advertisement />}
    </Layout>
  );
};

export default Index;
