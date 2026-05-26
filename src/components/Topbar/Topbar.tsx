import "./topbar.css";
import {
    Search,

} from "lucide-react";

import {
    FiUser,
    FiLock,
    FiMail,
    FiCheckSquare,
    FiMessageCircle,
    FiLogOut
} from "react-icons/fi";

import { useState } from "react";

export function Topbar() {


    const [open, setOpen] = useState(false);

    // PEGAR USUÁRIO DO LOCALSTORAGE
    const usuario = JSON.parse(
        localStorage.getItem("usuario") || "{}"
    );


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        window.location.href = "/login";
    };



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

                {/* PERFIL */}
                <div
                    className="user-box"
                    onClick={() => setOpen(!open)}
                >

                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt="avatar"
                        className="user-avatar-img"
                    />

                    <div className="user-info">
                        <strong>
                            {usuario?.nome || "Usuário"}
                        </strong>

                        <span>
                            {usuario?.cargo || "Administrador"}
                        </span>
                    </div>

                    {/* MENU */}
                    {open && (
                        <div className="dropdown-menu">

                            <MenuItem
                                icon={<FiUser />}
                                text="Perfil"
                            />

                            <MenuItem
                                icon={<FiLock />}
                                text="Redefinir senha"
                            />

                            <MenuItem
                                icon={<FiMail />}
                                text="Mensagens"
                            />

                            <MenuItem
                                icon={<FiCheckSquare />}
                                text="Tarefas"
                            />

                            <MenuItem
                                icon={<FiMessageCircle />}
                                text="Chats"
                            />

                            <MenuItem
                                icon={<FiLogOut />}
                                type="button"
                                onClick={handleLogout}
                                text="Logout"
                            />

                        </div>
                    )}

                </div>

            </div>

        </header>
    );
}

function MenuItem({
    icon,
    text,
    onClick
}: any) {

    return (
        <div className="menu-item"
            onClick={onClick}>

            <span className="menu-icon">
                {icon}
            </span>

            <span>{text}</span>

        </div>
    );
}

