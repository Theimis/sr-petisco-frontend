import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    Package,
    Beef,
    ClipboardList,
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

                <NavLink to="/dashboard" className="menu-link">
                    <LayoutDashboard size={20} />
                    Dashboard
                </NavLink>

                <NavLink to="/produtos" className="menu-link">
                    <Package size={20} />
                    Produtos
                </NavLink>

                <NavLink to="/insumos" className="menu-link">
                    <Beef size={20} />
                    Insumos
                </NavLink>

                <NavLink to="/fichas" className="menu-link">
                    <ClipboardList size={20} />
                    Fichas Técnicas
                </NavLink>

            </nav>

        </aside>
    );
}
