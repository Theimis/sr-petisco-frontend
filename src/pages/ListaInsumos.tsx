import { useEffect, useState } from "react";
import { api } from "../services/api";

export function ListaInsumos() {
    const [insumos, setInsumos] = useState<any[]>([]);
    const [filtroTipo, setFiltroTipo] = useState("todos");
    const [filtroCategoria, setFiltroCategoria] = useState("todas");

    async function carregar() {
        try {
            const res = await api.get("/insumos");
            setInsumos(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (error) {
            console.error("Erro ao carregar insumos:", error);
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    const categorias = [
        ...new Set(insumos.map((i) => i.categoria)),
    ];

    let filtrados = insumos;

    if (filtroTipo !== "todos") {
        filtrados = filtrados.filter(
            (i) => i.tipo === filtroTipo
        );
    }

    if (filtroCategoria !== "todas") {
        filtrados = filtrados.filter(
            (i) => i.categoria === filtroCategoria
        );
    }

    function formatar(i: any) {
        return `${i.qtdLiquida} ${i.unidade}`;
    }

    return (
        <div
            style={{
                background: "#0f172a",
                color: "#fff",
                borderRadius: 20,
                padding: 25,
                border: "1px solid #1e293b",
                boxShadow: "0 0 30px rgba(0,0,0,0.4)",
            }}
        >
            {/* TOPO */}
            <div
                style={{
                    marginBottom: 25,
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        fontSize: 32,
                        fontWeight: "bold",
                    }}
                >
                    Insumos
                </h1>

                <p
                    style={{
                        color: "#94a3b8",
                        marginTop: 5,
                    }}
                >
                    Gerencie todos os insumos cadastrados
                </p>
            </div>

            {/* FILTROS */}
            <div
                style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginBottom: 20,
                }}
            >
                {[
                    "todos",
                    "base",
                    "processado",
                    "transformado",
                ].map((tipo) => (
                    <button
                        key={tipo}
                        onClick={() => setFiltroTipo(tipo)}
                        style={{
                            padding: "10px 16px",
                            borderRadius: 10,
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                            background:
                                filtroTipo === tipo
                                    ? "linear-gradient(135deg, #dc2626, #991b1b)"
                                    : "#111827",
                            color: "#fff",
                            boxShadow:
                                filtroTipo === tipo
                                    ? "0 0 15px rgba(220,38,38,0.4)"
                                    : "none",
                        }}
                    >
                        {tipo.charAt(0).toUpperCase() +
                            tipo.slice(1)}
                    </button>
                ))}
            </div>

            {/* SELECT */}
            <select
                value={filtroCategoria}
                onChange={(e) =>
                    setFiltroCategoria(e.target.value)
                }
                style={{
                    padding: "12px",
                    background: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "10px",
                    color: "#fff",
                    marginBottom: 25,
                    outline: "none",
                }}
            >
                <option value="todas">
                    Todas categorias
                </option>

                {categorias.map((c, index) => (
                    <option key={index} value={c}>
                        {c}
                    </option>
                ))}
            </select>

            {/* CARDS */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: 20,
                }}
            >
                {filtrados.map((i) => (
                    <div
                        key={i._id}
                        style={{
                            background: "#111827",
                            border:
                                "1px solid rgba(255,255,255,0.05)",
                            borderRadius: 18,
                            padding: 20,
                            boxShadow:
                                "0 10px 25px rgba(0,0,0,0.25)",
                        }}
                    >
                        <h2
                            style={{
                                margin: 0,
                                marginBottom: 10,
                                fontSize: 22,
                            }}
                        >
                            {i.nome}
                        </h2>

                        <p style={{ color: "#94a3b8" }}>
                            Categoria: {i.categoria}
                        </p>

                        <div
                            style={{
                                marginTop: 20,
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                            }}
                        >
                            <span>
                                📦 Tipo: {i.tipo || "-"}
                            </span>

                            <span>
                                ⚖️ Quantidade: {formatar(i)}
                            </span>

                            <span>
                                💰 Valor Unitário: R${" "}
                                {Number(
                                    i.valorUnitario || 0
                                ).toFixed(2)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}