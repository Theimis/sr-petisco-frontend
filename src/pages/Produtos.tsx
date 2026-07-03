import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import {
    Plus,
    Search,
    Filter,
    Edit3,
    Trash2,
    ArrowDownRight,
    Package,
    ChevronDown,
} from "lucide-react";
import "./produtos.css";

interface Produto {
    _id: string;
    nome: string;
    categoria: string;
    preco: number;
    estoque?: number;
}

export function Produtos() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
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
    const cmvPadrao = 60;

    const categorias = useMemo(() => {
        const lista = produtos
            .map((produto) => produto.categoria || "")
            .filter(Boolean);

        return Array.from(new Set(lista)).sort();
    }, [produtos]);

    const produtosFiltrados = produtos.filter((produto) => {
        const nomeMatch = produto.nome
            .toLowerCase()
            .includes(busca.toLowerCase());

        const categoriaMatch = categoriaFiltro
            ? produto.categoria === categoriaFiltro
            : true;

        return nomeMatch && categoriaMatch;
    });

    function parsePrecoInput(value: string) {
        const formatted = value.replace(/\s+/g, "").replace(",", ".");
        return Number(formatted);
    }

    function formatCurrency(value: number) {
        return `R$ ${value.toFixed(2).replace(".", ",")}`;
    }

    function calcularCusto(precoValue: number) {
        return precoValue * (cmvPadrao / 100);
    }

    function calcularMargem(precoValue: number) {
        return precoValue - calcularCusto(precoValue);
    }

    async function carregarProdutos() {
        try {
            setLoading(true);
            const res = await api.get("/produtos");
            setProdutos(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            toast.error("Erro ao carregar lista de produtos.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarProdutos();
    }, []);

    function limparFormulario() {
        setNome("");
        setCategoria("");
        setPreco("");
        setEditandoId(null);
        setMostrarFormulario(false);
    }

    async function cadastrarProduto() {
        const precoValor = parsePrecoInput(preco);

        if (!nome.trim()) {
            toast.error("Por favor, preencha o nome do produto.");
            return;
        }
        if (!categoria.trim()) {
            toast.error("Por favor, preencha a categoria.");
            return;
        }
        if (!preco || precoValor <= 0 || Number.isNaN(precoValor)) {
            toast.error("Por favor, insira um preço válido maior que zero.");
            return;
        }

        try {
            setLoading(true);
            await api.post("/produtos", {
                nome,
                categoria,
                preco: precoValor,
                estoque: 0,
            });

            toast.success("Produto cadastrado com sucesso!");
            limparFormulario();
            await carregarProdutos();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao cadastrar produto!");
        } finally {
            setLoading(false);
        }
    }

    async function atualizarProduto() {
        if (!editandoId) {
            toast.error("Nenhum produto selecionado para editar.");
            return;
        }

        const precoValor = parsePrecoInput(preco);

        if (!nome.trim() || !categoria.trim() || !preco || precoValor <= 0 || Number.isNaN(precoValor)) {
            toast.error("Todos os campos devem ser preenchidos corretamente.");
            return;
        }

        try {
            setLoading(true);
            await api.put(`/produtos/${editandoId}`, {
                nome,
                categoria,
                preco: precoValor,
            });

            toast.success("Produto atualizado com sucesso!");
            limparFormulario();
            await carregarProdutos();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao atualizar produto.");
        } finally {
            setLoading(false);
        }
    }

    function abrirModalDelete(id: string) {
        setProdutoSelecionado(id);
        setModalDelete(true);
    }

    async function confirmarDelete() {
        if (!produtoSelecionado) {
            return;
        }

        try {
            setLoading(true);
            await api.delete(`/produtos/${produtoSelecionado}`);
            toast.success("Produto deletado!");
            await carregarProdutos();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao deletar produto!");
        } finally {
            setLoading(false);
            setModalDelete(false);
            setProdutoSelecionado(null);
        }
    }

    function editarProduto(produto: Produto) {
        setEditandoId(produto._id);
        setNome(produto.nome);
        setCategoria(produto.categoria);
        setPreco(produto.preco.toString().replace(".", ","));
        setMostrarFormulario(true);
    }

    function abrirFormulario() {
        setMostrarFormulario(true);
        setEditandoId(null);
        setNome("");
        setCategoria("");
        setPreco("");
    }

    const precoValorParaCalculo = parsePrecoInput(preco);
    const precoValorFormatado = Number.isNaN(precoValorParaCalculo) ? 0 : precoValorParaCalculo;

    return (
        <div className="page-container produtos-page">
            <Toaster position="top-right" />

            <div className="produtos-card">
                <div className="produtos-card__header">
                    <div className="produtos-card__header-center">
                        <div className="produtos-card__icon">
                            <Package size={20} />
                        </div>
                        <h1>TELA DE PRODUTOS</h1>
                    </div>
                </div>

                <div className="produtos-subtitle">
                    <p>Gerencie todos os produtos cadastrados com cálculo em tempo real.</p>
                    <button className="btn btn-primary produtos-create" onClick={abrirFormulario}>
                        <Plus size={16} /> Criar Produto
                    </button>
                </div>

                {mostraFormulario && (
                    <div className="modal-overlay modal-overlay--form">
                        <div className="modal-box modal-box--form">
                            <div className="modal-header">

                                <div className="modal-header-info">

                                    <span className="modal-tag">
                                        FICHA TÉCNICA
                                    </span>

                                    <h2 className="modal-title">
                                        Prato de teste
                                    </h2>

                                    <p className="modal-subtitle">
                                        Edição da ficha técnica do prato
                                    </p>

                                </div>

                                <button
                                    className="modal-close"
                                    onClick={limparFormulario}
                                >
                                    ×
                                </button>

                            </div>

                            <div className="modal-content">
                                <div className="produtos-form">
                                    <div className="produtos-form__fields">
                                        <label>
                                            Nome do produto
                                            <input
                                                placeholder="Ex: X-Bacon Artesanal"
                                                value={nome}
                                                onChange={(e) => setNome(e.target.value)}
                                            />
                                        </label>

                                        <label>
                                            Categoria
                                            <input
                                                placeholder="Ex: Lanches"
                                                value={categoria}
                                                onChange={(e) => setCategoria(e.target.value)}
                                            />
                                        </label>

                                        <label>
                                            Preço de venda (R$)
                                            <input
                                                placeholder="0,00"
                                                value={preco}
                                                onChange={(e) => setPreco(e.target.value)}
                                            />
                                        </label>
                                    </div>

                                    <div className="produtos-form__projection">
                                        <div>
                                            <span>Custo estimado</span>
                                            <strong>{formatCurrency(calcularCusto(precoValorFormatado))}</strong>
                                        </div>
                                        <div>
                                            <span>Margem estimada</span>
                                            <strong>{formatCurrency(calcularMargem(precoValorFormatado))}</strong>
                                        </div>
                                    </div>

                                    <div className="produtos-form__actions">
                                        <button
                                            className="btn btn-primary"
                                            onClick={editandoId ? atualizarProduto : cadastrarProduto}
                                            disabled={loading}
                                        >
                                            {loading
                                                ? "Salvando..."
                                                : editandoId
                                                    ? "Atualizar produto"
                                                    : "Cadastrar Produto"}
                                        </button>
                                        <button className="btn btn-secondary" onClick={limparFormulario}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="search-filter-container">
                    <div className="input-wrapper">
                        <Search className="input-icon" size={18} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Barra de pesquisa"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>

                    <div className="input-wrapper">
                        <Filter className="input-icon" size={18} />
                        <select
                            className="category-select"
                            value={categoriaFiltro}
                            onChange={(e) => setCategoriaFiltro(e.target.value)}
                        >
                            <option value="">Filtro por categoria</option>
                            {categorias.map((categoriaItem) => (
                                <option key={categoriaItem} value={categoriaItem}>
                                    {categoriaItem}
                                </option>
                            ))}
                        </select>
                        <div className="select-chevron">
                            <ChevronDown className="chevron-icon" size={16} />
                        </div>
                    </div>
                </div>

                <div className="produtos-table-wrapper">
                    <table className="produtos-table">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Categoria</th>
                                <th>Preço</th>
                                <th>Custo</th>
                                <th>Margem de Contribuição</th>
                                <th>CMV (%)</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {produtosFiltrados.map((produto) => {
                                const precoValor = Number(produto.preco);
                                const custo = calcularCusto(precoValor);
                                const margem = calcularMargem(precoValor);

                                return (
                                    <tr key={produto._id}>
                                        <td className="table-cell table-cell--produto">{produto.nome}</td>
                                        <td className="table-cell table-cell--categoria">{produto.categoria}</td>
                                        <td className="table-cell table-cell--preco">{formatCurrency(precoValor)}</td>
                                        <td className="table-cell table-cell--custo">{formatCurrency(custo)}</td>
                                        <td className="table-cell table-cell--margin">
                                            <div className="margin-chip">
                                                <ArrowDownRight size={14} /> {formatCurrency(margem)}
                                            </div>
                                        </td>
                                        <td className="table-cell table-cell--cmv">{cmvPadrao}%</td>
                                        <td className="produtos-table__actions">
                                            <button
                                                className="icon-button icon-button--edit"
                                                onClick={() => editarProduto(produto)}
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                className="icon-button icon-button--delete"
                                                onClick={() => abrirModalDelete(produto._id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {produtosFiltrados.length === 0 && (
                        <div className="produtos-empty">
                            Nenhum produto encontrado.
                        </div>
                    )}

                    <div className="produtos-footer">
                        <span>
                            Exibindo {produtosFiltrados.length} de {produtos.length} produtos.
                        </span>
                        <span className="produtos-footer__note">
                            Calculando margens automaticamente à taxa de CMV padrão de 60%.
                        </span>
                    </div>
                </div>
            </div>

            {modalDelete && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2>Deletar produto</h2>
                        <p>Tem certeza que deseja excluir este produto?</p>

                        <div className="modal-actions">
                            <button className="btn btn-danger" onClick={confirmarDelete}>
                                Sim, deletar
                            </button>
                            <button className="btn btn-cancel" onClick={() => setModalDelete(false)}>
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

