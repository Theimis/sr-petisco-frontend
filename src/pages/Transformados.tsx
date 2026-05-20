import { useEffect, useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

export function Transformados() {
    const [insumos, setInsumos] = useState<any[]>([]);
    const [itens, setItens] = useState<any[]>([]);

    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("");
    const [unidade, setUnidade] = useState("");
    const [rendimento, setRendimento] = useState("");

    const [insumoId, setInsumoId] = useState("");
    const [qtd, setQtd] = useState("");

    // carregar insumos
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

            toast.error("Erro ao carregar insumos");
        }
    }

    useEffect(() => {
        carregarInsumos();
    }, []);

    // adicionar item
    function addItem() {
        const insumo = insumos.find(
            i => i._id === insumoId
        );

        if (!insumo || !qtd) {
            return toast.error("Dados inválidos");
        }

        setItens([
            ...itens,
            {
                insumo: insumoId,
                nome: insumo.nome,
                unidade: insumo.unidade,
                qtdLiquida: Number(qtd),
                valorUnitario: insumo.valorUnitario
            }
        ]);

        toast.success("Ingrediente adicionado!");

        setQtd("");
    }

    // calcular total
    const total = itens.reduce((acc, i) => {
        return acc + (
            i.qtdLiquida * i.valorUnitario
        );
    }, 0);

    // salvar
    async function salvar() {
        try {

            if (!nome || !categoria || !unidade || !rendimento) {
                return toast.error(
                    "Preencha todos os campos"
                );
            }

            if (itens.length === 0) {
                return toast.error(
                    "Adicione pelo menos 1 ingrediente"
                );
            }

            await api.post("/transformados", {
                nome,
                categoria,
                unidade,
                rendimento: Number(rendimento),
                ingredientes: itens
            });

            toast.success(
                "Transformado criado!"
            );

            setNome("");
            setCategoria("");
            setUnidade("");
            setRendimento("");
            setItens([]);

        } catch (error: any) {

            console.error(
                error.response?.data || error
            );

            toast.error(
                error.response?.data?.message ||
                "Erro ao criar transformado"
            );
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
                            fontSize: 32,
                            margin: 0,
                            marginBottom: 5,
                        }}
                    >
                        🧪 Transformados
                    </h1>

                    <p style={{ color: "#94a3b8" }}>
                        Gerencie receitas e transformações
                    </p>
                </div>

                {/* FORM */}
                <div
                    style={{
                        background: "#111827",
                        padding: 20,
                        borderRadius: 18,
                        border: "1px solid rgba(255,255,255,0.05)",
                    }}
                >
                    <h2 style={{ marginBottom: 20 }}>
                        Novo Transformado
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
                            placeholder="Nome"
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
                            placeholder="Rendimento"
                            type="number"
                            value={rendimento}
                            onChange={(e) =>
                                setRendimento(e.target.value)
                            }
                            style={input}
                        />

                        <select
                            value={unidade}
                            onChange={(e) =>
                                setUnidade(e.target.value)
                            }
                            style={input}
                        >
                            <option value="">
                                Unidade
                            </option>

                            <option value="kg">
                                kg
                            </option>

                            <option value="g">
                                g
                            </option>

                            <option value="L">
                                L
                            </option>

                            <option value="ml">
                                ml
                            </option>

                            <option value="un">
                                un
                            </option>
                        </select>
                    </div>

                    {/* INGREDIENTES */}
                    <div style={{ marginTop: 30 }}>
                        <h3 style={{ marginBottom: 15 }}>
                            Adicionar Ingrediente
                        </h3>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "2fr 1fr auto",
                                gap: 15,
                                alignItems: "center",
                            }}
                        >
                            <select
                                value={insumoId}
                                onChange={(e) =>
                                    setInsumoId(
                                        e.target.value
                                    )
                                }
                                style={input}
                            >
                                <option value="">
                                    Selecione insumo
                                </option>

                                {insumos.map(i => (
                                    <option
                                        key={i._id}
                                        value={i._id}
                                    >
                                        {i.nome} ({i.unidade})
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                placeholder="Quantidade"
                                value={qtd}
                                onChange={(e) =>
                                    setQtd(e.target.value)
                                }
                                style={input}
                            />

                            <button
                                onClick={addItem}
                                style={button}
                            >
                                Adicionar
                            </button>
                        </div>
                    </div>

                    {/* LISTA */}
                    <div style={{ marginTop: 30 }}>
                        <h3>Itens Adicionados</h3>

                        <div
                            style={{
                                display: "grid",
                                gap: 15,
                                marginTop: 15,
                            }}
                        >
                            {itens.map((i, index) => (
                                <div
                                    key={index}
                                    style={{
                                        background: "#0f172a",
                                        border:
                                            "1px solid rgba(255,255,255,0.05)",
                                        borderRadius: 14,
                                        padding: 15,
                                    }}
                                >
                                    <strong>
                                        {i.nome}
                                    </strong>

                                    <p
                                        style={{
                                            color: "#94a3b8",
                                            marginTop: 8,
                                        }}
                                    >
                                        Quantidade:{" "}
                                        {i.qtdLiquida}{" "}
                                        {i.unidade}
                                    </p>

                                    <p
                                        style={{
                                            color: "#94a3b8",
                                        }}
                                    >
                                        Valor: R${" "}
                                        {(
                                            i.qtdLiquida *
                                            i.valorUnitario
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TOTAL */}
                    <div
                        style={{
                            marginTop: 25,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 20,
                        }}
                    >
                        <h2>
                            💰 Total: R$ {total.toFixed(2)}
                        </h2>

                        <button
                            onClick={salvar}
                            style={{
                                ...button,
                                padding: "14px 24px",
                            }}
                        >
                            Salvar Transformado
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const input: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    background: "#0f172a",
    border: "1px solid #374151",
    borderRadius: "12px",
    color: "#fff",
    outline: "none",
};

const button: React.CSSProperties = {
    padding: "12px 18px",
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