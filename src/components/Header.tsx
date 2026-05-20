import {
    Search,
    Bell
} from "lucide-react";

import "./header.css";

type Props = {
    title: string;
};

export function Header({ title }: Props) {
    return (
        <header className="header">

            <div>
                <h1>{title}</h1>
            </div>

            <div className="header-right">

                <div className="search-box">
                    <Search size={18} />
                    <input placeholder="Buscar..." />
                </div>

                <button className="notification">
                    <Bell size={18} />
                </button>

                <div className="profile">
                    <div className="avatar">
                        T
                    </div>

                    <div>
                        <strong>Theimis</strong>
                        <p>Administrador</p>
                    </div>
                </div>

            </div>

        </header>
    );
}