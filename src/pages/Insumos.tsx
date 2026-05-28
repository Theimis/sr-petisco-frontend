import { useEffect, useState } from "react";
import { api } from "../services/api";

export function Insumos() {
    const [insumos, setInsumos] = useState<any[]>([]);
    const [pesquisa, setPesquisa] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("todos");

    const [modoEdicao, setModoEdicao] = useState(false);

    const [dadosEditados, setDadosEditados] = useState<any>({ nome: "", rendimento: 0, valorTotal: 0, ingredientes: [], });



    const [modalAberto, setModalAberto] = useState(false);
    const [insumoSelecionado, setInsumoSelecionado] = useState<any>(null);



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

    function abrirModal(insumo: any) {

        setInsumoSelecionado(insumo);

        setDadosEditados({
            nome: insumo.nome || "",
            rendimento: insumo.rendimento || 0,
            valorTotal: insumo.valorTotal || 0,

            ingredientes:
                insumo.transformacao?.ingredientes || [],
        });

        setModalAberto(true);
    }

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
                                    onClick={() => abrirModal(insumo)}
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

            {modalAberto && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(3, 7, 18, 0.82)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                        padding: "20px",
                    }}
                >
                    <div
                        style={{
                            background: "#111827",
                            width: "100%",
                            maxWidth: "900px",
                            borderRadius: "24px",
                            border: "1px solid #1f2937",
                            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        {/* TOPO AZUL */}
                        <div
                            style={{
                                height: "5px",
                                background:
                                    "linear-gradient(90deg, #2563eb, #1d4ed8)",
                            }}
                        />

                        {/* BOTÃO FECHAR */}
                        <button
                            onClick={() => setModalAberto(false)}
                            style={{
                                position: "absolute",
                                top: 22,
                                right: 22,
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                border: "none",
                                background: "rgba(255,255,255,0.05)",
                                color: "#94a3b8",
                                fontSize: "18px",
                                cursor: "pointer",
                            }}
                        >
                            ✕
                        </button>

                        <div style={{ padding: "34px" }}>

                            {/* CABEÇALHO */}
                            <div style={{ marginBottom: 28 }}>

                                <span
                                    style={{
                                        background:
                                            "rgba(37,99,235,0.15)",
                                        color: "#60a5fa",
                                        fontSize: 11,
                                        fontWeight: "bold",
                                        letterSpacing: "1.5px",
                                        textTransform: "uppercase",
                                        padding: "6px 12px",
                                        borderRadius: "999px",
                                        border:
                                            "1px solid rgba(37,99,235,0.2)",
                                    }}
                                >
                                    Ficha Técnica
                                </span>

                                <h2
                                    style={{
                                        marginTop: 18,
                                        marginBottom: 8,
                                        fontSize: 34,
                                        fontWeight: 800,
                                        color: "#f8fafc",
                                        letterSpacing: "-1px",
                                    }}
                                >
                                    {modoEdicao ? (
                                        <input
                                            value={dadosEditados.nome}
                                            onChange={(e) =>
                                                setDadosEditados({
                                                    ...dadosEditados,
                                                    nome: e.target.value,
                                                })
                                            }
                                            style={{
                                                width: "100%",
                                                background: "#0f172a",
                                                border: "1px solid #334155",
                                                borderRadius: "12px",
                                                padding: "12px",
                                                color: "#fff",
                                                fontSize: "28px",
                                                fontWeight: 700,
                                            }}
                                        />
                                    ) : (
                                        insumoSelecionado?.nome
                                    )}
                                </h2>

                                <p
                                    style={{
                                        color: "#64748b",
                                        margin: 0,
                                        fontSize: 14,
                                    }}
                                >
                                    Visualização completa do produto
                                </p>
                            </div>

                            {/* DIVISOR */}
                            <div
                                style={{
                                    height: 1,
                                    background: "#1f2937",
                                    marginBottom: 28,
                                }}
                            />

                            {/* RENDIMENTO E VALOR */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 24,
                                }}
                            >
                                <div>
                                    <p
                                        style={{
                                            color: "#94a3b8",
                                            margin: 0,
                                            fontSize: 14,
                                        }}
                                    >
                                        Rendimento
                                    </p>

                                    <strong
                                        style={{
                                            color: "#f8fafc",
                                            fontSize: 22,
                                        }}
                                    >
                                        {modoEdicao ? (
                                            <input
                                                type="number"
                                                value={dadosEditados.rendimento}
                                                onChange={(e) =>
                                                    setDadosEditados({
                                                        ...dadosEditados,
                                                        rendimento: e.target.value,
                                                    })
                                                }
                                                style={{
                                                    width: "120px",
                                                    background: "#0f172a",
                                                    border: "1px solid #334155",
                                                    borderRadius: "10px",
                                                    padding: "8px",
                                                    color: "#fff",
                                                    fontSize: "18px",
                                                }}
                                            />
                                        ) : (
                                            <>
                                                {dadosEditados.rendimento}{" "}
                                                {insumoSelecionado?.unidade}
                                            </>
                                        )}
                                    </strong>
                                </div>

                                <div style={{ textAlign: "right" }}>
                                    <p
                                        style={{
                                            color: "#94a3b8",
                                            margin: 0,
                                            fontSize: 14,
                                        }}
                                    >
                                        Custo Total
                                    </p>

                                    <strong
                                        style={{
                                            color: "#10b981",
                                            fontSize: 28,
                                            fontWeight: 800,
                                            fontFamily: "monospace",
                                        }}
                                    >
                                        {modoEdicao ? (
                                            <input
                                                type="number"
                                                value={dadosEditados.valorTotal}
                                                onChange={(e) =>
                                                    setDadosEditados({
                                                        ...dadosEditados,
                                                        valorTotal: e.target.value,
                                                    })
                                                }
                                                style={{
                                                    width: "160px",
                                                    background: "#0f172a",
                                                    border: "1px solid #334155",
                                                    borderRadius: "10px",
                                                    padding: "8px",
                                                    color: "#10b981",
                                                    fontSize: "22px",
                                                    fontWeight: "bold",
                                                }}
                                            />
                                        ) : (
                                            <>R$ {dadosEditados.valorTotal}</>
                                        )}
                                    </strong>

                                </div>
                            </div>

                            {/* TABELA */}
                            <div
                                style={{
                                    border: "1px solid #1f2937",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    marginTop: 20,
                                }}
                            >

                                {/* CABEÇALHO */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "2fr 1fr 1fr",
                                        background: "#0f172a",
                                        padding: "16px 20px",
                                        color: "#94a3b8",
                                        fontWeight: "bold",
                                        fontSize: 13,
                                        borderBottom: "1px solid #1f2937",
                                    }}
                                >
                                    <span>Ingrediente</span>

                                    <span style={{ textAlign: "center" }}>
                                        Quantidade
                                    </span>

                                    <span style={{ textAlign: "center" }}>
                                        Unidade
                                    </span>
                                </div>

                                {/* INGREDIENTES */}
                                {insumoSelecionado?.transformacao?.ingredientes?.map(
                                    (ingrediente: any) => {

                                        const ingredienteCompleto =
                                            insumos.find(
                                                (i: any) =>
                                                    i._id === ingrediente.insumo
                                            );

                                        return (
                                            <div
                                                key={ingrediente._id}
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns:
                                                        "2fr 1fr 1fr",
                                                    padding: "18px 20px",
                                                    borderBottom:
                                                        "1px solid #1e293b",
                                                    alignItems: "center",
                                                    background: "#111827",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: "#f8fafc",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {ingredienteCompleto?.nome || "Ingrediente"}
                                                </span>

                                                <span
                                                    style={{
                                                        textAlign: "center",
                                                        color: "#cbd5e1",
                                                    }}
                                                >
                                                    {ingrediente.qtdLiquida}
                                                </span>

                                                <span
                                                    style={{
                                                        textAlign: "center",
                                                        color: "#cbd5e1",
                                                    }}
                                                >
                                                    {ingredienteCompleto?.unidade || "-"}
                                                </span>
                                            </div>
                                        );
                                    }
                                )}
                            </div>

                            {/* DIVISOR */}
                            <div
                                style={{
                                    height: 1,
                                    background: "#1f2937",
                                    marginTop: 30,
                                    marginBottom: 28,
                                }}
                            />

                            {/* RODAPÉ */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: "16px",
                                }}
                            >

                                {/* ESQUERDA */}
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "12px",
                                    }}
                                >

                                    <button
                                        style={{
                                            background: "#1f2937",
                                            color: "#cbd5e1",
                                            border: "1px solid #374151",
                                            borderRadius: "12px",
                                            padding: "12px 18px",
                                            fontSize: 14,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                        }}
                                    >
                                        🖨️ Imprimir
                                    </button>

                                    <button
                                        style={{
                                            background:
                                                "rgba(239,68,68,0.12)",
                                            color: "#f87171",
                                            border:
                                                "1px solid rgba(239,68,68,0.2)",
                                            borderRadius: "12px",
                                            padding: "12px 18px",
                                            fontSize: 14,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                        }}
                                    >
                                        🗑️ Deletar
                                    </button>

                                </div>

                                {/* DIREITA */}
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "12px",
                                        alignItems: "center",
                                    }}
                                >

                                    <button
                                        onClick={() => setModoEdicao(!modoEdicao)}
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #2563eb, #1d4ed8)",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "12px",
                                            padding: "12px 24px",
                                            fontSize: 14,
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            boxShadow:
                                                "0 10px 25px rgba(37,99,235,0.25)",
                                        }}
                                    >
                                        ✏️ Editar
                                    </button>

                                    <button
                                        onClick={() =>
                                            setModalAberto(false)
                                        }
                                        style={{
                                            background: "transparent",
                                            color: "#94a3b8",
                                            border: "none",
                                            fontSize: 14,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            padding: "10px 14px",
                                        }}
                                    >
                                        Fechar
                                    </button>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            )}
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