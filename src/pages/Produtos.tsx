import { useEffect, useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

export function Produtos() {

    const [produtos, setProdutos] = useState<any[]>([]);
    const [mostraFormulario, setMostrarFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState<string | null>(null);

    const [modalDelete, setModalDelete] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState<string | null>(null);

    const [busca, setBusca] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("");

    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("");
    const [preco, setPreco] = useState("");

    const [loading, setLoading] = useState(false);

    async function carregarProdutos() {
        try {
            setLoading(true);

            const res = await api.get("/produtos");

            setProdutos(
                Array.isArray(res.data.data)
                    ? res.data.data
                    : []
            );

        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarProdutos();
    }, []);

    async function cadastrarProduto() {
        try {
            console.log("DEBUG FRONT STATE:", {
                nome,
                categoria,
                preco
            });
            setLoading(true);
            console.log("STATE ATUAL:", { nome, categoria, preco });
            await api.post("/produtos", {
                nome,
                categoria,
                preco,
                estoque: 0,
            });

            toast.success("Produto cadastrado com sucesso!");

            setNome("");
            setCategoria("");
            setPreco("");
            setMostrarFormulario(false);

            await carregarProdutos();

        } catch (error: any) {
            toast.error("Erro ao cadastrar produto!");
        } finally {
            setLoading(false);
        }
    }

    async function atualizarProduto() {
        try {
            setLoading(true);

            await api.put(`/produtos/${editandoId}`, {
                nome,
                categoria,
                preco: Number(preco),
            });

            toast.success("Produto atualizado!");

            setNome("");
            setCategoria("");
            setPreco("");

            setEditandoId(null);
            setMostrarFormulario(false);

            await carregarProdutos();

        } catch (error) {
            toast.error("Erro ao atualizar produto");
        } finally {
            setLoading(false);
        }
    }

    function abrirModalDelete(id: string) {
        setProdutoSelecionado(id);
        setModalDelete(true);
    }

    async function confirmarDelete() {
        if (!produtoSelecionado) return;

        try {
            await api.delete(`/produtos/${produtoSelecionado}`);

            toast.success("Produto deletado!");
            await carregarProdutos();

        } catch (error) {
            toast.error("Erro ao deletar produto!");
        } finally {
            setModalDelete(false);
            setProdutoSelecionado(null);
        }
    }

    function editarProduto(produto: any) {
        setEditandoId(produto._id);
        setNome(produto.nome);
        setCategoria(produto.categoria);
        setPreco(String(produto.preco));
        setMostrarFormulario(true);
    }

    const produtosFiltrados = produtos.filter((produto) => {
        const nomeMatch = produto.nome
            ?.toLowerCase()
            .includes(busca.toLowerCase());

        const categoriaMatch = categoriaFiltro
            ? produto.categoria === categoriaFiltro
            : true;

        return nomeMatch && categoriaMatch;
    });

    return (
        <div className="page-container">

            <div style={{
                background: "#0f172a",
                color: "#fff",
                borderRadius: 20,
                padding: 25,
                border: "1px solid #1e293b",
                boxShadow: "0 0 30px rgba(0,0,0,0.4)",
            }}>

                {/* TOPO */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 25,
                }}>
                    <div>
                        <h1 style={{
                            color: "#fff",
                            margin: 0,
                            fontSize: 32,
                            fontWeight: "bold",
                        }}>
                            Produtos
                        </h1>

                        <p style={{
                            color: "#94a3b8",
                            marginTop: 5,
                        }}>
                            Gerencie todos os produtos cadastrados
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setMostrarFormulario(true);
                            setEditandoId(null);
                            setNome("");
                            setCategoria("");
                            setPreco("");
                        }}
                        style={{
                            padding: "14px 20px",
                            background: "linear-gradient(135deg, #dc2626, #991b1b)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "12px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: 15,
                            boxShadow: "0 0 20px rgba(220,38,38,0.4)",
                        }}
                    >
                        + Criar Produto
                    </button>
                </div>

                {/* FORM */}
                {mostraFormulario && (
                    <div style={{
                        background: "#111827",
                        border: "1px solid #1f2937",
                        padding: 20,
                        borderRadius: 16,
                        marginBottom: 25,
                    }}>
                        <h2>
                            {editandoId ? "Editar Produto" : "Novo Produto"}
                        </h2>

                        <div style={{
                            display: "flex",
                            gap: 15,
                            flexWrap: "wrap",
                        }}>
                            <input
                                placeholder="Nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                style={{
                                    flex: 1,
                                    minWidth: 220,
                                    padding: "14px",
                                    background: "#0f172a",
                                    border: "1px solid #374151",
                                    borderRadius: "12px",
                                    color: "#fff",
                                }}
                            />

                            <input
                                placeholder="Categoria"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                style={{
                                    flex: 1,
                                    minWidth: 220,
                                    padding: "14px",
                                    background: "#0f172a",
                                    border: "1px solid #374151",
                                    borderRadius: "12px",
                                    color: "#fff",
                                }}
                            />

                            <input
                                placeholder="Preço"
                                type="number"
                                value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                                style={{
                                    flex: 1,
                                    minWidth: 180,
                                    padding: "14px",
                                    background: "#111827",
                                    border: "1px solid #374151",
                                    borderRadius: "12px",
                                    color: "#fff",
                                }}
                            />
                        </div>

                        <div style={{ marginTop: 20 }}>
                            <button
                                onClick={
                                    editandoId
                                        ? atualizarProduto
                                        : cadastrarProduto
                                }
                                disabled={loading}
                                style={{
                                    padding: "14px 22px",
                                    background: "linear-gradient(135deg, #dc2626, #991b1b)",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                }}
                            >
                                {loading
                                    ? "Carregando..."
                                    : editandoId
                                        ? "Salvar Alterações"
                                        : "Cadastrar Produto"}
                            </button>
                        </div>
                    </div>
                )}

                {/* BUSCA + FILTRO (ESTILIZADO ORIGINAL MANTIDO) */}
                <div style={{
                    display: "flex",
                    gap: 15,
                    marginBottom: 20,
                    flexWrap: "wrap",
                }}>
                    <input
                        placeholder="Buscar produto..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        style={{
                            flex: 1,
                            minWidth: 220,
                            padding: "14px",
                            background: "#111827",
                            border: "1px solid #374151",
                            borderRadius: "12px",
                            color: "#fff",
                        }}
                    />

                    <select
                        value={categoriaFiltro}
                        onChange={(e) => setCategoriaFiltro(e.target.value)}
                        style={{
                            minWidth: 220,
                            padding: "14px",
                            background: "#111827",
                            border: "1px solid #374151",
                            borderRadius: "12px",
                            color: "#fff",
                        }}
                    >
                        <option value="">Todas categorias</option>
                        {[...new Set(produtos.map(p => p.categoria))]
                            .filter(Boolean)
                            .map(cat => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                    </select>
                </div>

                {/* LISTA MANTIDA */}
                {produtosFiltrados.map((produto) => (
                    <div key={produto._id} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: 10,
                        borderBottom: "1px solid #1e293b"
                    }}>
                        <span>{produto.nome}</span>

                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => editarProduto(produto)}>
                                Editar
                            </button>

                            <button onClick={() => abrirModalDelete(produto._id)}>
                                Deletar
                            </button>
                        </div>
                    </div>
                ))}

                {/* MODAL DELETE PROFISSIONAL */}
                {modalDelete && (
                    <div style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <div style={{
                            background: "#111827",
                            padding: 20,
                            borderRadius: 12,
                            minWidth: 300
                        }}>
                            <h3>Deseja realmente deletar este produto?</h3>

                            <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
                                <button
                                    onClick={confirmarDelete}
                                    style={{
                                        background: "#dc2626",
                                        color: "#fff",
                                        padding: 10,
                                        borderRadius: 8,
                                        border: "none"
                                    }}
                                >
                                    Sim
                                </button>

                                <button
                                    onClick={() => setModalDelete(false)}
                                    style={{
                                        background: "#1e293b",
                                        color: "#fff",
                                        padding: 10,
                                        borderRadius: 8,
                                        border: "none"
                                    }}
                                >
                                    Não
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}