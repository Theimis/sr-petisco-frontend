import { KPICard } from ".././components/KPICard/KPICard";
import { SalesChart } from ".././components/Charts/SalesChart";
import { Topbar } from "../components/Topbar/Topbar";
import React, { useState } from "react";
import { motion } from "framer-motion";
import "./dashboard.css";

import {
    DollarSign,
    ShoppingCart,
    TrendingUp,
    Banknote,
    Package,
    Users,
    CreditCard,
    Globe,
    Store,
    Layers,
    Award,
    Zap,
} from "lucide-react";

export const Dashboard: React.FC = () => {
    const [periodo, setPeriodo] = useState("Hoje");

    const periodos = [
        "Hoje",
        "Ontem",
        "Semana atual",
        "1 semana",
        "Mês atual",
        "1 mês",
        "Ano atual",
        "1 ano",
        "Todos",
    ];

    const kpis = [
        {
            title: "Valor das Vendas",
            value: "R$ 0,00",
            change: "0,0%",
            icon: DollarSign,
            color: "#10b981",
            bg: "rgba(16, 185, 129, 0.1)",
        },
        {
            title: "Quantidade de Vendas",
            value: "0",
            change: "0,0%",
            icon: ShoppingCart,
            color: "#3b82f6",
            bg: "rgba(59, 130, 246, 0.1)",
        },
        {
            title: "Ticket Médio",
            value: "R$ 0,00",
            change: "0,0%",
            icon: TrendingUp,
            color: "#f59e0b",
            bg: "rgba(245, 158, 11, 0.1)",
        },
        {
            title: "Estornos",
            value: "R$ 0,00",
            change: "0,0%",
            icon: Banknote,
            color: "#ef4444",
            bg: "rgba(239, 68, 68, 0.1)",
        },
    ];

    const receipts = [
        {
            name: "Dinheiro",
            percentage: "0%",
            value: "R$ 0,00",
            icon: DollarSign,
            color: "#10b981",
        },
        {
            name: "PIX",
            percentage: "0%",
            value: "R$ 0,00",
            icon: Zap,
            color: "#f59e0b",
        },
        {
            name: "Crédito",
            percentage: "0%",
            value: "R$ 0,00",
            icon: CreditCard,
            color: "#7c3aed",
        },
        {
            name: "Débito",
            percentage: "0%",
            value: "R$ 0,00",
            icon: CreditCard,
            color: "#3b82f6",
        },
        {
            name: "Recebimento on-line",
            percentage: "0%",
            value: "R$ 0,00",
            icon: Globe,
            color: "#ef4444",
        },
    ];

    const stats = [
        {
            label: "Produtos/Serviços",
            value: "0",
            icon: Package,
            color: "rgba(16, 185, 129, 0.1)",
            iconColor: "#10b981",
        },
        {
            label: "Clientes",
            value: "0",
            icon: Users,
            color: "rgba(245, 158, 11, 0.1)",
            iconColor: "#f59e0b",
        },
        {
            label: "Integrações",
            value: "0",
            icon: Layers,
            color: "rgba(59, 130, 246, 0.1)",
            iconColor: "#3b82f6",
        },
        {
            label: "Estabelecimentos",
            value: "0",
            icon: Store,
            color: "rgba(124, 58, 237, 0.1)",
            iconColor: "#7c3aed",
        },
    ];

    return (
        <div className="dashboard-container">

            <Topbar />

            {/* HEADER */}
            <header className="dashboard-header">

                <div className="filters-group">
                    {periodos.map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriodo(p)}
                            className={`filter-btn ${periodo === p ? "active" : ""}`}
                        >
                            {p}
                        </button>
                    ))}

                    <button className="filter-btn">
                        Intervalo <span>★</span>
                    </button>
                </div>

                <div className="establishment-group">
                    <select className="establishment-select">
                        <option>Todos os estabelecimentos</option>
                    </select>
                </div>

            </header>

            {/* HERO */}
            <section className="hero-row">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="welcome-card"
                >
                    <div className="welcome-icon-bg">
                        <Award size={32} color="#fff" />
                    </div>

                    <h1>
                        Estamos contentes em ter você conosco,
                        Administrador
                    </h1>

                    <p>
                        As métricas e objetivos podem ser alterados
                        <strong> apenas por administradores</strong>
                    </p>
                </motion.div>

                {kpis.slice(0, 2).map((kpi, idx) => (
                    <KPICard
                        key={idx}
                        title={kpi.title}
                        value={kpi.value}
                        change={kpi.change}
                        icon={kpi.icon}
                        color={kpi.color}
                        bg={kpi.bg}
                    />
                ))}

            </section>

            {/* PEDIDOS + METAS */}
            <section className="content-row">

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="data-panel"
                >
                    <div className="panel-header">
                        <h3>Pedidos on-line</h3>
                        <span>Integrações</span>
                    </div>

                    <div className="stats-grid">

                        <div className="modern-stat-box">
                            <h4>0</h4>
                            <p>Solicitados</p>
                        </div>

                        <div className="modern-stat-box">
                            <h4>R$ 0,00</h4>
                            <p>Valor das solicitações</p>
                        </div>

                        <div className="stat-footer-info">
                            <span>Sobre o faturamento: 0,0%</span>
                            <span>Dias com pedidos: 0</span>
                        </div>

                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="data-panel"
                >
                    <div className="panel-header">
                        <h3>Acompanhamento das metas</h3>
                    </div>

                    <div className="goals-container">

                        <div className="progress-circle">

                            <svg
                                className="circle-svg"
                                viewBox="0 0 200 200"
                            >
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="90"
                                    className="circle-bg"
                                />

                                <circle
                                    cx="100"
                                    cy="100"
                                    r="90"
                                    className="circle-progress"
                                    style={{ strokeDashoffset: 565 }}
                                />
                            </svg>

                            <div className="progress-text">
                                <span className="label">
                                    Objetivo Alcançado
                                </span>

                                <span className="value">
                                    0%
                                </span>
                            </div>

                        </div>

                        <div className="goal-details">

                            <div className="goal-price-main">
                                <h5>R$ 0,00</h5>
                                <p>Meta alcançada</p>
                            </div>

                            <div className="goal-summary-fatura">

                                <div className="goal-card-mini">
                                    <h6 className="fatura-val">
                                        R$ 0,00
                                    </h6>

                                    <span className="fatura-label">
                                        Total das metas
                                    </span>
                                </div>

                                <div className="goal-card-mini">
                                    <h6 className="fatura-val">
                                        R$ 0,00
                                    </h6>

                                    <span className="fatura-label">
                                        Total faturado
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>
                </motion.div>

            </section>

            {/* CHARTS */}
            <section className="charts-row">

                {/* RADAR */}
                {/* RADAR */}
                <div className="data-panel">

                    <div className="panel-header">
                        <h3>Vendas por Estabelecimento</h3>
                    </div>

                    <div className="radar-wrapper">

                        <div className="radar-mock">

                            {[100, 80, 60, 40, 20].map((size, idx) => (
                                <div
                                    key={idx}
                                    className="radar-ring"
                                    style={{
                                        width: `${size}%`,
                                        height: `${size}%`,
                                    }}
                                />
                            ))}

                            <svg
                                className="radar-shape"
                                viewBox="0 0 300 300"
                            >
                                <polygon
                                    points="150,50 235,110 205,220 95,220 65,110"
                                    className="radar-data"
                                />
                            </svg>

                            <div className="radar-center-glow"></div>

                        </div>

                        <div className="radar-sales">
                            <span className="dot"></span>
                            <span>Vendas</span>
                        </div>

                    </div>

                </div>

                {/* TRIANGLE */}
                <div className="data-panel">

                    <div className="panel-header">
                        <h3>Operações</h3>
                    </div>

                    <div className="operations-legend">

                        <div className="legend-item">
                            <span className="legend-dot sales"></span>
                            <p>Vendas</p>
                        </div>

                        <div className="legend-item">
                            <span className="legend-dot purchases"></span>
                            <p>Compras</p>
                        </div>

                    </div>

                    <div className="radar-wrapper">

                        <div className="triangle-chart">

                            <div className="triangle-label top">
                                Manhã
                            </div>

                            <div className="triangle-label left">
                                Tarde
                            </div>

                            <div className="triangle-label right">
                                Noite
                            </div>

                            <svg
                                viewBox="0 0 300 260"
                                className="triangle-svg"
                            >

                                <polygon
                                    points="150,20 280,220 20,220"
                                    className="triangle-bg"
                                />

                                <polygon
                                    points="150,60 240,200 60,200"
                                    className="triangle-middle"
                                />

                                <polygon
                                    points="150,100 200,180 100,180"
                                    className="triangle-small"
                                />

                                <line
                                    x1="150"
                                    y1="20"
                                    x2="150"
                                    y2="220"
                                    className="triangle-line"
                                />

                                <line
                                    x1="20"
                                    y1="220"
                                    x2="280"
                                    y2="220"
                                    className="triangle-line"
                                />

                                <line
                                    x1="20"
                                    y1="220"
                                    x2="150"
                                    y2="20"
                                    className="triangle-line"
                                />

                                <line
                                    x1="280"
                                    y1="220"
                                    x2="150"
                                    y2="20"
                                    className="triangle-line"
                                />

                                <polygon
                                    points="150,90 210,180 95,180"
                                    className="triangle-data"
                                />

                            </svg>

                        </div>

                    </div>

                </div>

                {/* RECEBIMENTOS */}
                <div className="data-panel">

                    <div className="panel-header">
                        <h3>Recebimentos</h3>
                    </div>

                    <div className="receipts-list">

                        {receipts.map((item, i) => (
                            <div key={i} className="receipt-item">

                                <div className="receipt-left">

                                    <div className="receipt-icon">
                                        <item.icon
                                            size={16}
                                            color={item.color}
                                        />
                                    </div>

                                    <div className="receipt-info">
                                        <h6>{item.name}</h6>
                                        <span>{item.percentage}</span>
                                    </div>

                                </div>

                                <div className="receipt-right">
                                    <span style={{ color: item.color }}>
                                        {item.value}
                                    </span>
                                </div>

                            </div>
                        ))}

                    </div>

                </div>

            </section>

            {/* STATS */}
            <section className="stats-bar">

                {stats.map((s, i) => (
                    <div key={i} className="stat-card">

                        <div
                            className="stat-icon-circ"
                            style={{ background: s.color }}
                        >
                            <s.icon
                                size={20}
                                color={s.iconColor}
                            />
                        </div>

                        <div className="stat-text">
                            <h4>{s.value}</h4>
                            <p>{s.label}</p>
                        </div>

                    </div>
                ))}

            </section>

            <SalesChart />

            {/* TABELAS */}
            <section className="tables-section">

                <div className="table-wrapper">

                    <div className="table-header">
                        <h3>
                            Os 10 itens com o maior faturamento
                        </h3>

                        <span>Vendidos no período</span>
                    </div>

                    <div className="table-content">

                        <table>

                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Categoria</th>
                                    <th style={{ textAlign: "right" }}>
                                        Quantidade
                                    </th>
                                    <th style={{ textAlign: "right" }}>
                                        Valor
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="empty-state"
                                    >
                                        Nenhum item vendido no período
                                        selecionado.
                                    </td>
                                </tr>
                            </tbody>

                        </table>

                    </div>

                    <div className="table-footer">
                        Total: 0 itens faturados
                    </div>

                </div>

                <div className="table-wrapper">

                    <div className="table-header">
                        <h3>Usuários</h3>
                        <span>Ativos no sistema</span>
                    </div>

                    <div className="table-content">

                        <table>

                            <thead>
                                <tr>
                                    <th>Nome</th>

                                    <th style={{ textAlign: "right" }}>
                                        Acessos
                                    </th>

                                    <th style={{ textAlign: "right" }}>
                                        Última Conexão
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="empty-state"
                                    >
                                        Nenhum usuário conectado hoje.
                                    </td>
                                </tr>
                            </tbody>

                        </table>

                    </div>

                    <div
                        className="table-footer"
                        style={{ color: "#71717a" }}
                    >
                        Total: 0 usuários
                    </div>

                </div>

            </section>

        </div>
    );
};
