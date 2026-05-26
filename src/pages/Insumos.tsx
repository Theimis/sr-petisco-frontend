import { useEffect, useState } from "react";
import { api } from "../services/api";

export function Insumos() {
    const [insumos, setInsumos] = useState<any[]>([]);
    const [pesquisa, setPesquisa] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("todos");

    const insumosFiltrados = insumos.filter((insumo) => {

        const matchPesquisa =
            insumo.nome
                ?.toLowerCase()
                .includes(pesquisa.toLowerCase());

        const matchTipo =
            filtroTipo === "todos"
                ? true
                : insumo.tipo === filtroTipo;

        return matchPesquisa && matchTipo;
    });

    async function carregarInsumos() {
        try {
            const res = await api.get("/insumos");

            setInsumos(
                Array.isArray(res.data.data)
                    ? res.data.data
                    : []
            );

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        carregarInsumos();
    }, []);


    // async function deletarInsumo(id: string) {
    //      try {
    //         await api.delete(`/insumos/${id}`);

    //         toast.success("Insumo deletado!");
    //
    //         await carregarInsumos();

    //    } catch (error) {

    //      toast.error("Erro ao deletar insumo");

    //      console.error(error);
    //  }
    //}

    return (
        <div className="page-container">
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
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 25,
                    }}
                >
                    <div>
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
                            Gerencie os insumos do sistema
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                        }}
                    >

                        <input
                            placeholder="Pesquisar insumo..."
                            value={pesquisa}
                            onChange={(e) =>
                                setPesquisa(e.target.value)
                            }
                            style={{
                                ...inputStyle,
                                width: 240,
                            }}
                        />

                        <select
                            value={filtroTipo}
                            onChange={(e) =>
                                setFiltroTipo(e.target.value)
                            }
                            style={{
                                ...inputStyle,
                                width: 180,
                            }}
                        >
                            <option value="todos">
                                Todos
                            </option>

                            <option value="base">
                                Base
                            </option>

                            <option value="transformado">
                                Transformado
                            </option>
                        </select>

                    </div>


                </div>

                {/* TABELA */}
                <div style={{ marginTop: 20 }}>

                    {/* CABEÇALHO */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "2fr 1.3fr 1.3fr 1.6fr 1fr 1fr 1fr 1.3fr 140px",
                            background: "#111827",
                            padding: "16px 20px",
                            borderRadius: "14px 14px 0 0",
                            border: "1px solid #1f2937",
                            color: "#94a3b8",
                            fontWeight: "bold",
                            fontSize: 14,
                        }}
                    >
                        <span style={{ textAlign: "left" }}>Nome</span>


                        <span style={{ textAlign: "center" }}>Tipo</span>

                        <span style={{ textAlign: "center" }}>Categoria</span>

                        <span style={{ textAlign: "center" }}>Fornecedor</span>

                        <span style={{ textAlign: "center" }}>Rendimento</span>

                        <span style={{ textAlign: "center" }}>Fichas</span>

                        <span style={{ textAlign: "center" }}>Unidade</span>

                        <span style={{ textAlign: "center" }}>Valor Unitário</span>

                        <span style={{ textAlign: "center" }}>Ações</span>

                    </div>

                    {/* LISTA */}
                    {insumosFiltrados.map((insumo) => (

                        <div
                            key={insumo._id}
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "2fr 1.3fr 1.3fr 1.6fr 1fr 1fr 1fr 1.3fr 140px",


                                alignItems: "center",
                                background: "#0f172a",
                                padding: "18px 20px",
                                borderBottom:
                                    "1px solid #1e293b",
                            }}
                        >
                            <strong>{insumo.nome}</strong>

                            <span style={{ textAlign: "center" }}>
                                {insumo.tipo || "base"}
                            </span>

                            <span style={{ textAlign: "center" }}>
                                {insumo.categoria}
                            </span>

                            <span style={{ textAlign: "center" }}>
                                {insumo.fornecedor || "-"}
                            </span>

                            <span style={{ textAlign: "center" }}>
                                {insumo.qtdLiquida || 0}
                            </span>

                            <span style={{ textAlign: "center" }}>
                                {insumo.fichas || 0}
                            </span>

                            <span style={{ textAlign: "center" }}>
                                {insumo.unidade}
                            </span>

                            <span style={{ textAlign: "center" }}>
                                R$ {insumo.valorTotal}
                            </span>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%",
                                }}
                            >

                                <button
                                    style={{
                                        ...buttonStyle,
                                        padding: "8px 18px",
                                        minWidth: "80px",
                                        height: "38px",
                                        background:
                                            "linear-gradient(135deg, #2563eb, #1d4ed8)",
                                        boxShadow: "none",
                                    }}
                                >
                                    Ver
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    background: "#0f172a",
    border: "1px solid #374151",
    borderRadius: "12px",
    color: "#fff",
    outline: "none",
};

const buttonStyle: React.CSSProperties = {
    padding: "14px 22px",
    background:
        "linear-gradient(135deg, #dc2626, #991b1b)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 0 15px rgba(220,38,38,0.4)",
};