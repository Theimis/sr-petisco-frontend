import { ProtectedRoute } from "./ProtectedRoute";

import { Routes, Route, Navigate } from "react-router-dom";

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
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />

            {/* DASHBOARD */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* PRODUTOS */}
            <Route
                path="/produtos"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Produtos />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* INSUMOS */}
            <Route
                path="/insumos"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Insumos />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* TRANSFORMADOS */}
            <Route
                path="/transformados"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Transformados />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* FICHAS */}
            <Route
                path="/fichas"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Fichas />
                        </Layout>
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

