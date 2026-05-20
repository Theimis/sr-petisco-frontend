import { useEffect, useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

export function Produtos() {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [mostraFormulario, setMostrarFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState<string | null>(null);

    const [busca, setBusca] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("");

    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("");
    const [preco, setPreco] = useState("");

    async function carregarProdutos() {
        try {
            const res = await api.get("/produtos");

            setProdutos(
                Array.isArray(res.data.data)
                    ? res.data.data
                    : []
            );

        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    }

    useEffect(() => {
        carregarProdutos();
    }, []);

    async function cadastrarProduto() {
        try {
            await api.post("/produtos", {
                nome,
                categoria,
                preco: Number(preco),
                estoque: 0,
            });

            await carregarProdutos();

            toast.success("Produto cadastrado com sucesso!");

            setNome("");
            setCategoria("");
            setPreco("");

            setMostrarFormulario(false);

        } catch (error: any) {

            toast.error("Erro ao cadastrar produto!");

            console.error(
                "Erro ao cadastrar:",
                error.response?.data || error
            );
        }
    }

    async function atualizarProduto() {
        try {
            await api.put(`/produtos/${editandoId}`, {
                nome,
                categoria,
                preco: Number(preco),
            });

            toast.success("Produto atualizado!");

            await carregarProdutos();

            setNome("");
            setCategoria("");
            setPreco("");

            setEditandoId(null);

            setMostrarFormulario(false);

        } catch (error: any) {

            toast.error("Erro ao atualizar produto");

            console.error(
                error.response?.data || error
            );
        }
    }

    async function deletarProduto(id: string) {
        try {
            await api.delete(`/produtos/${id}`);

            await carregarProdutos();

            toast.success("Produto deletado!");

        } catch (error) {

            toast.error("Erro ao deletar produto!");

            console.error("Erro ao deletar:", error);
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
                                color: "#fff",
                                margin: 0,
                                fontSize: 32,
                                fontWeight: "bold",
                            }}
                        >
                            Produtos
                        </h1>

                        <p
                            style={{
                                color: "#94a3b8",
                                marginTop: 5,
                            }}
                        >
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
                            background:
                                "linear-gradient(135deg, #dc2626, #991b1b)",
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
                                ? "Editar Produto"
                                : "Novo Produto"}
                        </h2>

                        <div
                            style={{
                                display: "flex",
                                gap: 15,
                                flexWrap: "wrap",
                            }}
                        >
                            <input
                                placeholder="Nome"
                                value={nome}
                                onChange={(e) =>
                                    setNome(e.target.value)
                                }
                                style={{
                                    flex: 1,
                                    minWidth: 220,
                                    padding: "14px",
                                    background: "#0f172a",
                                    border: "1px solid #374151",
                                    borderRadius: "12px",
                                    color: "#fff",
                                    outline: "none",
                                }}
                            />

                            <input
                                placeholder="Categoria"
                                value={categoria}
                                onChange={(e) =>
                                    setCategoria(e.target.value)
                                }
                                style={{
                                    flex: 1,
                                    minWidth: 220,
                                    padding: "14px",
                                    background: "#0f172a",
                                    border: "1px solid #374151",
                                    borderRadius: "12px",
                                    color: "#fff",
                                    outline: "none",
                                }}
                            />

                            <input
                                placeholder="Preço"
                                type="number"
                                value={preco}
                                onChange={(e) =>
                                    setPreco(e.target.value)
                                }
                                style={{
                                    flex: 1,
                                    minWidth: 180,
                                    padding: "14px",
                                    background: "#111827",
                                    border: "1px solid #374151",
                                    borderRadius: "12px",
                                    color: "#fff",
                                    outline: "none",
                                }}
                            />
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: 15,
                                marginTop: 20,
                            }}
                        >
                            <button
                                onClick={
                                    editandoId
                                        ? atualizarProduto
                                        : cadastrarProduto
                                }
                                style={{
                                    padding: "14px 22px",
                                    background:
                                        "linear-gradient(135deg, #dc2626, #991b1b)",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    boxShadow:
                                        "0 0 15px rgba(220,38,38,0.4)",
                                }}
                            >
                                {editandoId
                                    ? "Salvar Alterações"
                                    : "Cadastrar Produto"}
                            </button>

                            <button
                                onClick={() => {
                                    setMostrarFormulario(false);

                                    setEditandoId(null);

                                    setNome("");
                                    setCategoria("");
                                    setPreco("");
                                }}
                                style={{
                                    padding: "14px 22px",
                                    background: "#1e293b",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {/* BUSCA + FILTRO */}
                <div
                    style={{
                        display: "flex",
                        gap: 15,
                        marginBottom: 20,
                        flexWrap: "wrap",
                    }}
                >
                    <input
                        type="text"
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
                            outline: "none",
                        }}
                    />

                    <select
                        value={categoriaFiltro}
                        onChange={(e) =>
                            setCategoriaFiltro(e.target.value)
                        }
                        style={{
                            minWidth: 220,
                            padding: "14px",
                            background: "#111827",
                            border: "1px solid #374151",
                            borderRadius: "12px",
                            color: "#fff",
                            outline: "none",
                        }}
                    >
                        <option value="">
                            Todas categorias
                        </option>

                        {[...new Set(produtos.map((p) => p.categoria))]
                            .filter(Boolean)
                            .map((categoria) => (
                                <option
                                    key={categoria}
                                    value={categoria}
                                >
                                    {categoria}
                                </option>
                            ))}
                    </select>
                </div>

                {/* TABELA */}
                <div style={{ marginTop: 20 }}>

                    {/* Cabeçalho */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "2fr 1fr 1fr 1fr 1fr 220px",
                            background: "#111827",
                            padding: "16px 20px",
                            borderRadius: "14px 14px 0 0",
                            border: "1px solid #1f2937",
                            color: "#94a3b8",
                            fontWeight: "bold",
                            fontSize: 14,
                        }}
                    >
                        <span>Produto</span>
                        <span>Categoria</span>
                        <span>Preço</span>
                        <span>Custo</span>
                        <span>CMV</span>
                        <span>Ações</span>
                    </div>

                    {/* Produtos */}
                    {produtosFiltrados.map((produto) => (
                        <div
                            key={produto._id}
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "2fr 1fr 1fr 1fr 1fr 220px",
                                alignItems: "center",
                                background: "#0f172a",
                                padding: "18px 20px",
                                borderBottom:
                                    "1px solid #1e293b",
                                transition: "0.3s",
                            }}
                        >
                            <div>
                                <strong
                                    style={{
                                        color: "#fff",
                                        fontSize: 16,
                                    }}
                                >
                                    {produto.nome}
                                </strong>
                            </div>

                            <span style={{ color: "#cbd5e1" }}>
                                {produto.categoria}
                            </span>

                            <span style={{ color: "#22c55e" }}>
                                R$ {produto.preco}
                            </span>

                            <span style={{ color: "#e2e8f0" }}>
                                R$ {produto.custo?.toFixed(2) || "0.00"}
                            </span>

                            <span style={{ color: "#facc15" }}>
                                {produto.cmv?.toFixed(2) || "0.00"}%
                            </span>

                            <div
                                style={{
                                    display: "flex",
                                    gap: 10,
                                }}
                            >
                                <button
                                    onClick={() =>
                                        editarProduto(produto)
                                    }
                                    style={{
                                        padding: "10px",
                                        background:
                                            "linear-gradient(135deg, #2563eb, #1d4ed8)",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: 10,
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() =>
                                        deletarProduto(produto._id)
                                    }
                                    style={{
                                        padding: "10px",
                                        background:
                                            "linear-gradient(135deg, #dc2626, #991b1b)",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: 10,
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                        boxShadow:
                                            "0 0 12px rgba(220,38,38,0.35)",
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