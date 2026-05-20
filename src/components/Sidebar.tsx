import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Beef,
    ClipboardList,
    CookingPot,
    Wallet,
    BarChart3,
    ShoppingCart,
} from "lucide-react";

import "./sidebar.css";

export function Sidebar() {

    return (
        <aside className="sidebar">

            {/* LOGO */}
            <div className="sidebar-logo">

                <div className="logo-circle">
                    SR
                </div>

                <div>
                    <h2>SR Petisco</h2>
                    <span>Sistema de Gestão</span>
                </div>

            </div>

            <nav className="sidebar-menu">

                {/* GESTÃO */}
                <span className="menu-section">
                    GESTÃO
                </span>

                <NavLink to="/dashboard" className="menu-link">
                    <LayoutDashboard size={18} />
                    Dashboard
                </NavLink>

                {/* ESTOQUE */}
                <span className="menu-section">
                    ESTOQUE
                </span>

                <NavLink to="/produtos" className="menu-link">
                    <Package size={18} />
                    Produtos
                </NavLink>

                <NavLink to="/insumos" className="menu-link">
                    <Beef size={18} />
                    Insumos
                </NavLink>

                <NavLink to="/transformados" className="menu-link">
                    <CookingPot size={18} />
                    Transformados
                </NavLink>

                {/* PRODUÇÃO */}
                <span className="menu-section">
                    PRODUÇÃO
                </span>

                <NavLink to="/fichas" className="menu-link">
                    <ClipboardList size={18} />
                    Fichas Técnicas
                </NavLink>

                {/* FINANCEIRO */}
                <span className="menu-section">
                    FINANCEIRO
                </span>

                <NavLink to="/vendas" className="menu-link">
                    <ShoppingCart size={18} />
                    Vendas
                </NavLink>

                <NavLink to="/fluxo-caixa" className="menu-link">
                    <Wallet size={18} />
                    Fluxo de Caixa
                </NavLink>

                <NavLink to="/relatorios" className="menu-link">
                    <BarChart3 size={18} />
                    Relatórios
                </NavLink>

            </nav>

        </aside>
    );
}

