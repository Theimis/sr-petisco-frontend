import { useEffect, useState } from "react";
import { api } from "../services/api";

export function Fichas() {
    const [insumos, setInsumos] = useState<any[]>([]);
    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("");
    const [preco, setPreco] = useState("");
    const [itens, setItens] = useState<any[]>([]);

    const [insumoSelecionado, setInsumoSelecionado] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [fichas, setFichas] = useState<any[]>([]);

    useEffect(() => {
        carregarInsumos();
        carregarFichas();
    }, []);

    async function carregarInsumos() {
        const res = await api.get("/insumos");
        setInsumos(
            Array.isArray(res.data.data)
                ? res.data.data
                : []
        );
    }

    async function carregarFichas() {
        const res = await api.get("/fichas");

        setFichas(
            Array.isArray(res.data.data)
                ? res.data.data
                : []
        );
    }

    function adicionarItem() {
        if (!insumoSelecionado) {
            return alert("Selecione um insumo");
        }

        if (!quantidade || Number(quantidade) <= 0) {
            return alert("Quantidade inválida");
        }

        setItens([
            ...itens,
            {
                insumo: insumoSelecionado,
                quantidade: Number(quantidade),
            },
        ]);

        setQuantidade("");
    }

    async function salvarFicha() {
        try {
            if (!nome || !categoria || !preco) {
                return alert(
                    "Preencha nome, categoria e preço"
                );
            }

            if (itens.length === 0) {
                return alert(
                    "Adicione pelo menos 1 insumo"
                );
            }

            await api.post("/fichas", {
                nomeProduto: nome,
                categoria,
                precoVenda: Number(preco),
                ingredientes: itens,
            });

            alert("Ficha criada com sucesso!");

            await carregarFichas();

            setNome("");
            setCategoria("");
            setPreco("");
            setItens([]);

        } catch (err: any) {
            console.error(
                "ERRO BACKEND:",
                err.response?.data
            );

            alert(
                err.response?.data?.message ||
                "Erro ao criar ficha"
            );
        }
    }

    async function deletarFicha(id: string) {
        try {
            await api.delete(`/fichas/${id}`);

            alert("Ficha deletada!");

            await carregarFichas();

        } catch (error) {
            console.error(error);
            alert("Erro ao deletar ficha");
        }
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
                <div style={{ marginBottom: 25 }}>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: 32,
                        }}
                    >
                        📋 Fichas Técnicas
                    </h1>

                    <p
                        style={{
                            color: "#94a3b8",
                            marginTop: 5,
                        }}
                    >
                        Gerencie as fichas técnicas dos produtos
                    </p>
                </div>

                {/* FORM */}
                <div
                    style={{
                        background: "#111827",
                        border: "1px solid #1f2937",
                        padding: 20,
                        borderRadius: 16,
                        marginBottom: 30,
                    }}
                >
                    <h2 style={{ marginBottom: 20 }}>
                        Nova Ficha
                    </h2>

                    <div
                        style={{
                            display: "flex",
                            gap: 15,
                            flexWrap: "wrap",
                        }}
                    >
                        <input
                            placeholder="Nome do Produto"
                            value={nome}
                            onChange={(e) =>
                                setNome(e.target.value)
                            }
                            style={input}
                        />

                        <input
                            placeholder="Categoria"
                            value={categoria}
                            onChange={(e) =>
                                setCategoria(e.target.value)
                            }
                            style={input}
                        />

                        <input
                            placeholder="Preço"
                            type="number"
                            value={preco}
                            onChange={(e) =>
                                setPreco(e.target.value)
                            }
                            style={input}
                        />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: 15,
                            marginTop: 20,
                            flexWrap: "wrap",
                        }}
                    >
                        <select
                            onChange={(e) =>
                                setInsumoSelecionado(
                                    e.target.value
                                )
                            }
                            style={input}
                        >
                            <option value="">
                                Selecione insumo
                            </option>

                            {Array.isArray(insumos) &&
                                insumos.map((i) => (
                                    <option
                                        key={i._id}
                                        value={i._id}
                                    >
                                        {i.nome}
                                    </option>
                                ))}
                        </select>

                        <input
                            placeholder="Quantidade"
                            type="number"
                            value={quantidade}
                            onChange={(e) =>
                                setQuantidade(
                                    e.target.value
                                )
                            }
                            style={input}
                        />

                        <button
                            onClick={adicionarItem}
                            style={button}
                        >
                            + Adicionar
                        </button>
                    </div>

                    {/* ITENS */}
                    <div style={{ marginTop: 20 }}>
                        {itens.map((item, index) => {
                            const insumoEncontrado =
                                insumos.find(
                                    (i) =>
                                        String(i._id) ===
                                        String(item.insumo)
                                );

                            return (
                                <div
                                    key={index}
                                    style={{
                                        background:
                                            "#0f172a",
                                        padding: 12,
                                        borderRadius: 12,
                                        marginBottom: 10,
                                        border:
                                            "1px solid rgba(255,255,255,0.05)",
                                    }}
                                >
                                    🧂{" "}
                                    {insumoEncontrado?.nome} —
                                    {item.quantidade}
                                </div>
                            );
                        })}
                    </div>

                    <button
                        onClick={salvarFicha}
                        style={{
                            ...button,
                            marginTop: 20,
                        }}
                    >
                        Salvar Ficha
                    </button>
                </div>

                {/* FICHAS */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: 20,
                    }}
                >
                    {fichas.map((ficha) => (
                        <div
                            key={ficha._id}
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
                            <h2>{ficha.produto}</h2>

                            <p
                                style={{
                                    color: "#94a3b8",
                                }}
                            >
                                {ficha.categoria}
                            </p>

                            <div
                                style={{
                                    marginTop: 15,
                                    display: "flex",
                                    flexDirection:
                                        "column",
                                    gap: 8,
                                }}
                            >
                                <span>
                                    💰 Preço: R${" "}
                                    {ficha.precoVenda}
                                </span>

                                <span>
                                    📉 Custo: R${" "}
                                    {ficha.custoTotal}
                                </span>

                                <span>
                                    📈 Lucro: R${" "}
                                    {ficha.lucro}
                                </span>

                                <span>
                                    🎯 CMV: {ficha.cmv}%
                                </span>
                            </div>

                            <div
                                style={{
                                    marginTop: 20,
                                }}
                            >
                                <h4>Ingredientes</h4>

                                {ficha.ingredientes.map(
                                    (
                                        ing: any,
                                        index: number
                                    ) => (
                                        <div
                                            key={index}
                                            style={{
                                                background:
                                                    "#0f172a",
                                                padding: 10,
                                                borderRadius: 10,
                                                marginTop: 8,
                                            }}
                                        >
                                            🧂 {ing.nome} —
                                            {ing.quantidade}{" "}
                                            {ing.unidade}
                                        </div>
                                    )
                                )}
                            </div>

                            <button
                                onClick={() =>
                                    deletarFicha(
                                        ficha._id
                                    )
                                }
                                style={{
                                    ...button,
                                    width: "100%",
                                    marginTop: 20,
                                }}
                            >
                                Deletar
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const input: React.CSSProperties = {
    flex: 1,
    minWidth: 220,
    padding: "14px",
    background: "#0f172a",
    border: "1px solid #374151",
    borderRadius: "12px",
    color: "#fff",
    outline: "none",
};

const button: React.CSSProperties = {
    padding: "14px 20px",
    background:
        "linear-gradient(135deg, #dc2626, #991b1b)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow:
        "0 0 15px rgba(220,38,38,0.4)",
};