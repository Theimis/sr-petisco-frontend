import "./topbar.css";

import {
    Bell,
    Search,
    Settings,
} from "lucide-react";

export function Topbar() {
    return (
        <header className="topbar">

            <div className="topbar-left">
                <h1>Dashboard</h1>
                <span>Visão geral do sistema</span>
            </div>

            <div className="topbar-right">

                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Buscar..."
                    />
                </div>

                <button className="topbar-icon">
                    <Bell size={18} />
                </button>

                <button className="topbar-icon">
                    <Settings size={18} />
                </button>

                <div className="user-box">
                    <div className="user-avatar">
                        TL
                    </div>

                    <div className="user-info">
                        <strong>Theimis</strong>
                        <span>Administrador</span>
                    </div>
                </div>

            </div>

        </header>
    );
}