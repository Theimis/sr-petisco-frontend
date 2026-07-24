import React from "react";
import { Topbar } from "../components/Topbar/Topbar";
import "./dashboard.css";
import {
    CalendarDays,
    Package,
    Boxes,
    RefreshCw,
    Factory,
} from "lucide-react";

export const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            <Topbar />

            <div className="dashboard-header">

                <div className="dashboard-title">
                    <h1>Olá, Admin! 👋</h1>
                    <p>Aqui está o resumo geral da sua operação</p>
                </div>

                <div className="dashboard-actions">

                    <div className="period-card">
                        <CalendarDays size={18} />

                        <span>
                            20/05/2025 - 20/06/2025
                        </span>
                    </div>

                    <div className="user-card">

                        <div className="user-avatar">
                            A
                        </div>

                        <div className="user-info">
                            <strong>Admin</strong>
                            <span>Administrador</span>
                        </div>

                    </div>

                </div>

            </div>

            {/* Área onde ficarão todos os cards do dashboard */}
            <div className="dashboard-cards">

                <div className="dashboard-card">

                    <div className="card-content">

                        <div className="card-icon">
                            <Package size={45} color="#2F80ED" strokeWidth={1.8} />
                        </div>

                        <div className="card-info">

                            <div className="card-header">
                                <span>Total de Insumos</span>
                            </div>

                            <div className="card-value">
                                0
                            </div>

                            <div className="card-footer">
                                <span className="card-trend">+12%</span>
                                <span className="card-period">
                                    vs perido anterior
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="dashboard-card">

                    <div className="card-content">

                        <div className="card-icon green">
                            <Boxes size={45} color="#22C55E" strokeWidth={1.8} />
                        </div>

                        <div className="card-info">

                            <div className="card-header">
                                <span>Total de Produtos</span>
                            </div>

                            <div className="card-value">
                                0
                            </div>

                            <div className="card-footer">
                                <span className="card-trend">+8%</span>
                                <span className="card-period">
                                    vs perido anterior
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="dashboard-card">

                    <div className="card-content">

                        <div className="card-icon orange">
                            <RefreshCw size={45} color="#F59E0B" strokeWidth={1.8} />
                        </div>

                        <div className="card-info">

                            <div className="card-header">
                                <span>Total de Transformações</span>
                            </div>

                            <div className="card-value">
                                0
                            </div>

                            <div className="card-footer">
                                <span className="card-trend">+5%</span>
                                <span className="card-period">
                                    vs perido anterior
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="dashboard-card">

                    <div className="card-content">

                        <div className="card-icon purple">
                            <Factory size={45} color="#A855F7" strokeWidth={1.8} />
                        </div>

                        <div className="card-info">

                            <div className="card-header">
                                <span>Produções Realizadas</span>
                            </div>

                            <div className="card-value">
                                0
                            </div>

                            <div className="card-footer">
                                <span className="card-trend">+5%</span>
                                <span className="card-period">
                                    vs perido anterior
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};