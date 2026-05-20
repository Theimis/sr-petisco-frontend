import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

export function Insumos() {
    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("");
    const [fornecedor, setFornecedor] = useState("");
    const [unidade, setUnidade] = useState("");
    const [qtdBruta, setQtdBruta] = useState("");
    const [qtdLiquida, setQtdLiquida] = useState("");
    const [valorTotal, setValorTotal] = useState("");

    const [insumos, setInsumos] = useState<any[]>([]);
    const [mostraFormulario, setMostrarFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState<string | null>(null);

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

    async function criarInsumo() {
        try {
            await api.post("/insumos", {
                nome,
                categoria,
                fornecedor: fornecedor || undefined,
                unidade,
                qtdBruta: Number(qtdBruta),
                qtdLiquida: Number(qtdLiquida || qtdBruta),
                valorTotal: Number(valorTotal),
            });

            await carregarInsumos();

            toast.success("Insumo criado com sucesso!");

            limparFormulario();

        } catch (error: any) {

            toast.error("Erro ao criar insumo");

            console.error(
                "Erro ao criar insumo:",
                error.response?.data || error
            );
        }
    }

    async function atualizarInsumo() {
        try {
            await api.put(`/insumos/${editandoId}`, {
                nome,
                categoria,
                fornecedor,
                unidade,
                qtdBruta: Number(qtdBruta),
                qtdLiquida: Number(qtdLiquida),
                valorTotal: Number(valorTotal),
            });

            toast.success("Insumo atualizado!");

            await carregarInsumos();

            limparFormulario();

        } catch (error: any) {

            toast.error("Erro ao atualizar insumo");

            console.error(
                error.response?.data || error
            );
        }
    }

    async function deletarInsumo(id: string) {
        try {
            await api.delete(`/insumos/${id}`);

            toast.success("Insumo deletado!");

            await carregarInsumos();

        } catch (error) {

            toast.error("Erro ao deletar insumo");

            console.error(error);
        }
    }

    function editarInsumo(insumo: any) {
        setEditandoId(insumo._id);

        setNome(insumo.nome || "");
        setCategoria(insumo.categoria || "");
        setFornecedor(insumo.fornecedor || "");
        setUnidade(insumo.unidade || "");

        setQtdBruta(String(insumo.qtdBruta || ""));
        setQtdLiquida(String(insumo.qtdLiquida || ""));
        setValorTotal(String(insumo.valorTotal || ""));

        setMostrarFormulario(true);
    }

    function limparFormulario() {
        setNome("");
        setCategoria("");
        setFornecedor("");
        setUnidade("");
        setQtdBruta("");
        setQtdLiquida("");
        setValorTotal("");

        setEditandoId(null);

        setMostrarFormulario(false);
    }

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

                    <button
                        onClick={() => {
                            limparFormulario();
                            setMostrarFormulario(true);
                        }}
                        style={buttonStyle}
                    >
                        + Novo Insumo
                    </button>
                </div>

                {/* FORMULÁRIO */}
                {mostraFormulario && (
                    <div
                        style={{
                            background: "#111827",
                            border: "1px solid #1f2937",
                            padding: 20,
                            borderRadius: 16,
                            marginBottom: 25,
                        }}
                    >
                        <h2 style={{ marginBottom: 20 }}>
                            {editandoId
                                ? "Editar Insumo"
                                : "Novo Insumo"}
                        </h2>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(220px, 1fr))",
                                gap: 15,
                            }}
                        >
                            <input
                                placeholder="Nome do insumo"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                style={inputStyle}
                            />

                            <input
                                placeholder="Categoria"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                style={inputStyle}
                            />

                            <input
                                placeholder="Fornecedor"
                                value={fornecedor}
                                onChange={(e) => setFornecedor(e.target.value)}
                                style={inputStyle}
                            />

                            <select
                                value={unidade}
                                onChange={(e) => setUnidade(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="">
                                    Selecione unidade
                                </option>

                                <option value="kg">kg</option>
                                <option value="g">g</option>
                                <option value="L">L</option>
                                <option value="ml">ml</option>
                                <option value="un">un</option>
                            </select>

                            <input
                                type="number"
                                placeholder="Quantidade Bruta"
                                value={qtdBruta}
                                onChange={(e) =>
                                    setQtdBruta(e.target.value)
                                }
                                style={inputStyle}
                            />

                            <input
                                type="number"
                                placeholder="Quantidade Líquida"
                                value={qtdLiquida}
                                onChange={(e) =>
                                    setQtdLiquida(e.target.value)
                                }
                                style={inputStyle}
                            />

                            <input
                                type="number"
                                placeholder="Valor Total"
                                value={valorTotal}
                                onChange={(e) =>
                                    setValorTotal(e.target.value)
                                }
                                style={inputStyle}
                            />
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: 15,
                                marginTop: 25,
                                flexWrap: "wrap",
                            }}
                        >
                            <button
                                onClick={
                                    editandoId
                                        ? atualizarInsumo
                                        : criarInsumo
                                }
                                style={buttonStyle}
                            >
                                {editandoId
                                    ? "Salvar Alterações"
                                    : "Salvar Insumo"}
                            </button>

                            <button
                                onClick={limparFormulario}
                                style={{
                                    ...buttonStyle,
                                    background:
                                        "linear-gradient(135deg, #1e293b, #0f172a)",
                                    boxShadow:
                                        "0 0 15px rgba(255,255,255,0.08)",
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {/* TABELA */}
                <div style={{ marginTop: 20 }}>

                    {/* CABEÇALHO */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "2fr 1fr 1fr 1fr 1fr 1fr 220px",
                            background: "#111827",
                            padding: "16px 20px",
                            borderRadius: "14px 14px 0 0",
                            border: "1px solid #1f2937",
                            color: "#94a3b8",
                            fontWeight: "bold",
                            fontSize: 14,
                        }}
                    >
                        <span>Nome</span>
                        <span>Categoria</span>
                        <span>Fornecedor</span>
                        <span>Qtd</span>
                        <span>Unidade</span>
                        <span>Valor</span>
                        <span>Ações</span>
                    </div>

                    {/* LISTA */}
                    {insumos.map((insumo) => (
                        <div
                            key={insumo._id}
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "2fr 1fr 1fr 1fr 1fr 1fr 220px",
                                alignItems: "center",
                                background: "#0f172a",
                                padding: "18px 20px",
                                borderBottom:
                                    "1px solid #1e293b",
                            }}
                        >
                            <strong>{insumo.nome}</strong>

                            <span>{insumo.categoria}</span>

                            <span>
                                {insumo.fornecedor || "-"}
                            </span>

                            <span>{insumo.qtdLiquida}</span>

                            <span>{insumo.unidade}</span>

                            <span>
                                R$ {insumo.valorTotal}
                            </span>

                            <div
                                style={{
                                    display: "flex",
                                    gap: 10,
                                }}
                            >
                                <button
                                    onClick={() =>
                                        editarInsumo(insumo)
                                    }
                                    style={{
                                        ...buttonStyle,
                                        padding: "10px",
                                        background:
                                            "linear-gradient(135deg, #2563eb, #1d4ed8)",
                                        boxShadow: "none",
                                    }}
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() =>
                                        deletarInsumo(insumo._id)
                                    }
                                    style={{
                                        ...buttonStyle,
                                        padding: "10px",
                                        boxShadow: "none",
                                    }}
                                >
                                    Deletar
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