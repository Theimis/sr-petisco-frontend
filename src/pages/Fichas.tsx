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

    // MODAL DELETE
    const [modalDelete, setModalDelete] = useState(false);
    const [fichaSelecionada, setFichaSelecionada] = useState<string | null>(null);

    useEffect(() => {
        carregarInsumos();
        carregarFichas();
    }, []);

    async function carregarInsumos() {
        const res = await api.get("/insumos");
        setInsumos(Array.isArray(res.data.data) ? res.data.data : []);
    }

    async function carregarFichas() {
        const res = await api.get("/fichas");
        setFichas(Array.isArray(res.data.data) ? res.data.data : []);
    }

    function adicionarItem() {
        if (!insumoSelecionado) return alert("Selecione um insumo");
        if (!quantidade || Number(quantidade) <= 0) return alert("Quantidade inválida");

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
            await api.post("/fichas", {
                nome,
                categoria,
                preco,
                ingredientes: itens,
            });

            alert("Ficha criada com sucesso!");

            await carregarFichas();

            setNome("");
            setCategoria("");
            setPreco("");
            setItens([]);

        } catch (err: any) {
            console.error(err.response?.data);
            alert(err.response?.data?.message || "Erro ao criar ficha");
        }
    }

    // ABRIR MODAL DELETE
    function abrirModalDelete(id: string) {
        setFichaSelecionada(id);
        setModalDelete(true);
    }

    // CONFIRMAR DELETE
    async function confirmarDelete() {
        if (!fichaSelecionada) return;

        try {
            await api.delete(`/fichas/${fichaSelecionada}`);
            await carregarFichas();

            alert("Ficha deletada!");
        } catch (error) {
            alert("Erro ao deletar ficha");
        } finally {
            setModalDelete(false);
            setFichaSelecionada(null);
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
                <div style={{ marginBottom: 40 }}>
                    <h1 style={{ margin: 0, fontSize: 32 }}>
                        📋 Fichas Técnicas
                    </h1>

                    <p style={{ color: "#94a3b8", marginTop: 5 }}>
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

                    <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
                        <input
                            placeholder="Nome do Produto"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            style={input}
                        />

                        <input
                            placeholder="Categoria"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            style={input}
                        />

                        <input
                            placeholder="Preço"
                            type="number"
                            value={preco}
                            onChange={(e) => setPreco(e.target.value)}
                            style={input}
                        />
                    </div>

                    <div style={{ display: "flex", gap: 15, marginTop: 20 }}>
                        <select
                            onChange={(e) => setInsumoSelecionado(e.target.value)}
                            style={input}
                        >
                            <option value="">Selecione insumo</option>

                            {insumos.map((i) => (
                                <option key={i._id} value={i._id}>
                                    {i.nome}
                                </option>
                            ))}
                        </select>

                        <input
                            placeholder="Quantidade"
                            type="number"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            style={input}
                        />

                        <button onClick={adicionarItem} style={button}>
                            + Adicionar
                        </button>
                    </div>

                    <button onClick={salvarFicha} style={{ ...button, marginTop: 20 }}>
                        Salvar Ficha
                    </button>
                </div>

                {/* LISTA */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
                    {fichas.map((ficha) => (
                        <div
                            key={ficha._id}
                            style={{
                                background: "#111827",
                                border: "1px solid rgba(255,255,255,0.05)",
                                borderRadius: 18,
                                padding: 20,
                            }}
                        >
                            <h2>{ficha.produto}</h2>

                            <p style={{ color: "#94a3b8" }}>
                                {ficha.categoria}
                            </p>

                            <button
                                onClick={() => abrirModalDelete(ficha._id)}
                                style={{
                                    ...button,
                                    width: "100%",
                                    marginTop: 20,
                                    background: "linear-gradient(135deg,#dc2626,#991b1b)"
                                }}
                            >
                                Deletar
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ========================= */}
            {/* MODAL PROFISSIONAL DELETE */}
            {/* ========================= */}
            {modalDelete && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2>Deseja deletar esta ficha?</h2>

                        <p>Essa ação não pode ser desfeita.</p>

                        <div className="modal-actions">
                            <button onClick={confirmarDelete} className="btn-danger">
                                Sim
                            </button>

                            <button
                                onClick={() => {
                                    setModalDelete(false);
                                    setFichaSelecionada(null);
                                }}
                                className="btn-cancel"
                            >
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
};

const button: React.CSSProperties = {
    padding: "14px 20px",
    background: "linear-gradient(135deg, #dc2626, #991b1b)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
};