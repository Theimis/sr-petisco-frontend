import "./navbar.css";

type Props = {
    onNavigate: (page: string) => void;
};

export function Navbar({ onNavigate }: Props) {
    return (
        <nav className="navbar">
            <h2>SR Petisco</h2>

            <div>
                <button onClick={() => onNavigate("listaInsumos")}>
                    Ver Insumos
                </button>

                <button onClick={() => onNavigate("cadastroInsumo")}>
                    Cadastrar Insumos
                </button>

                <button onClick={() => onNavigate("transformados")}>
                    Transformados
                </button>

                <button onClick={() => onNavigate("fichas")}>
                    Ficha Técnica
                </button>

                <button onClick={() => onNavigate("produtos")}>
                    Produtos
                </button>

                <button onClick={() => onNavigate("dashboard")}>
                    Dashboard
                </button>

                <button onClick={() => onNavigate("login")}>
                    Login
                </button>
            </div>
        </nav>
    );
}