import { Routes, Route } from "react-router-dom";

import { Layout } from "../components/Layout";

import { Login } from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import { Produtos } from "../pages/Produtos";
import { Insumos } from "../pages/Insumos";
import { Transformados } from "../pages/Transformados";
import { Fichas } from "../pages/Fichas";

export function AppRoutes() {
    return (
        <Routes>

            {/* LOGIN */}
            <Route path="/" element={<Login />} />

            {/* SISTEMA */}
            <Route
                path="/dashboard"
                element={
                    <Layout>
                        <Dashboard />
                    </Layout>
                }
            />

            <Route
                path="/produtos"
                element={
                    <Layout>
                        <Produtos />
                    </Layout>
                }
            />

            <Route
                path="/insumos"
                element={
                    <Layout>
                        <Insumos />
                    </Layout>
                }
            />

            <Route
                path="/transformados"
                element={
                    <Layout>
                        <Transformados />
                    </Layout>
                }
            />

            <Route
                path="/fichas"
                element={
                    <Layout>
                        <Fichas />
                    </Layout>
                }
            />

        </Routes>
    );
}