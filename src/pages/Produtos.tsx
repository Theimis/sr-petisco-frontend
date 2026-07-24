import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import {
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

    const [ingredientesProduto, setIngredientesProduto] = useState<any[]>([]);

    const [insumos, setInsumos] = useState<any[]>([]);

    const [pesquisasIngredientes, setPesquisasIngredientes] = useState<{
        [key: number]: string;
    }>({});

    const [quantidadesIngredientes, setQuantidadesIngredientes] = useState<{
        [key: number]: string;
    }>({});

    const [inputAberto, setInputAberto] = useState<number | null>(null);

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

    function calcularCMV() {

        if (!precoValorFormatado) {
            return 0;
        }

        return (custoTotal / precoValorFormatado) * 100;
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

    async function carregarInsumos() {
        try {
            const res = await api.get("/insumos");

            setInsumos(
                Array.isArray(res.data.data)
                    ? res.data.data
                    : []
            );

        } catch (error) {
            console.error("Erro ao carregar insumos:", error);
        }
    }

    useEffect(() => {
        carregarProdutos();
        carregarInsumos();
    }, []);

    function limparFormulario() {
        setNome("");
        setCategoria("");
        setPreco("");

        setEditandoId(null);
        setMostrarFormulario(false);

        // Limpa completamente a ficha técnica
        setIngredientesProduto([]);

        setPesquisasIngredientes({});

        setInputAberto(null);
    }

    async function cadastrarProduto() {
        const precoValor = parsePrecoInput(preco);

        const ingredientesFicha = ingredientesProduto.map((ingrediente) => ({
            insumo: ingrediente.insumo,
            quantidade: ingrediente.qtdLiquida,
        }));

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

        if (ingredientesFicha.length === 0) {
            toast.error("Adicione pelo menos um ingrediente.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/fichas", {
                nome,
                categoria,
                preco: precoValor,
                ingredientes: ingredientesFicha,
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

    const custoTotal = ingredientesProduto.reduce((total, ingrediente) => {

        const insumo = insumos.find(
            (i: any) => i._id === ingrediente.insumo
        );

        if (!insumo) return total;

        return total + (insumo.valorUnitario * ingrediente.qtdLiquida);

    }, 0);

    return (
        <div className="page-container produtos-page">
            <Toaster position="top-right" />
            <div className="produtos-title">

                <h1>
                    <Package size={30} />
                    <span>Produtos</span>
                </h1>

                <p>
                    Gerencie todos os produtos cadastrados com cálculo em tempo real.
                </p>

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
                                    Produto
                                </h2>

                                <p className="modal-subtitle">
                                    Cadastro e edição do produto
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

                                    <div className="produto-field">
                                        <label>Nome do produto</label>
                                        <input
                                            className="produto-input"
                                            placeholder="Ex: X-Bacon Artesanal"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                        />
                                    </div>

                                    <div className="produto-field">
                                        <label>Categoria</label>
                                        <input
                                            className="produto-input"
                                            placeholder="Ex: Lanches"
                                            value={categoria}
                                            onChange={(e) => setCategoria(e.target.value)}
                                        />
                                    </div>

                                    <div className="produto-field">
                                        <label>Preço de venda (R$)</label>
                                        <input
                                            className="produto-input"
                                            placeholder="0,00"
                                            value={preco}
                                            onChange={(e) => setPreco(e.target.value)}
                                        />
                                    </div>

                                </div>

                                <div className="produto-resumo">
                                    <div className="produto-card">

                                        <span>Custo Total</span>

                                        <strong className="text-green">
                                            {formatCurrency(custoTotal)}
                                        </strong>

                                    </div>

                                    <div className="produto-card">

                                        <span>CMV (%)</span>

                                        <strong className="text-yellow">
                                            {calcularCMV().toFixed(1)}%
                                        </strong>

                                    </div>

                                    <div className="produto-card">

                                        <span>Margem de Contribuição (R$)</span>

                                        <strong className="text-green">
                                            {formatCurrency(precoValorFormatado - custoTotal)}
                                        </strong>

                                    </div>

                                </div>

                                <div className="produto-ingredientes">
                                    <div className="produto-ingredientes-scroll">
                                        <table className="produto-ingredientes-table">


                                            <thead>
                                                <tr>
                                                    <th>Ingrediente</th>
                                                    <th>Quantidade</th>
                                                    <th>Unidade</th>
                                                    <th>Custo</th>
                                                    <th>Ação</th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                {ingredientesProduto.map((ingrediente, index) => {

                                                    const insumosPesquisa = insumos.filter((ins: any) =>
                                                        ins.nome
                                                            ?.toLowerCase()
                                                            .includes((pesquisasIngredientes[index] || "").toLowerCase())
                                                    );
                                                    const insumoSelecionado = insumos.find(
                                                        (ins: any) => ins._id === ingrediente.insumo
                                                    );
                                                    const custoLinha =
                                                        (insumoSelecionado?.valorUnitario || 0) *
                                                        (ingrediente.qtdLiquida || 0);
                                                    return (

                                                        <tr key={index}>

                                                            <td>

                                                                <div
                                                                    style={{ position: "relative", width: "100%" }}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >

                                                                    <input
                                                                        className="ingrediente-input"
                                                                        placeholder="Pesquisar ingrediente..."
                                                                        value={pesquisasIngredientes[index] || ""}
                                                                        onFocus={() => setInputAberto(index)}
                                                                        onChange={(e) =>
                                                                            setPesquisasIngredientes({
                                                                                ...pesquisasIngredientes,
                                                                                [index]: e.target.value,
                                                                            })
                                                                        }
                                                                    />

                                                                    {inputAberto === index &&
                                                                        (pesquisasIngredientes[index] || "") && (

                                                                            <div className="produto-dropdown">

                                                                                {insumosPesquisa.slice(0, 10).map((ins: any) => (

                                                                                    <div
                                                                                        key={ins._id}
                                                                                        className="produto-dropdown-item"
                                                                                        onClick={() => {

                                                                                            const novosIngredientes = [...ingredientesProduto];

                                                                                            novosIngredientes[index] = {
                                                                                                ...novosIngredientes[index],
                                                                                                insumo: ins._id,
                                                                                                pesquisando: false,
                                                                                            };

                                                                                            setIngredientesProduto(novosIngredientes);

                                                                                            setPesquisasIngredientes({
                                                                                                ...pesquisasIngredientes,
                                                                                                [index]: ins.nome,
                                                                                            });

                                                                                            setInputAberto(null);

                                                                                        }}
                                                                                    >
                                                                                        {ins.nome}
                                                                                    </div>

                                                                                ))}

                                                                            </div>

                                                                        )}

                                                                </div>

                                                            </td>

                                                            <td>

                                                                <input
                                                                    className="quantidade-input"
                                                                    placeholder="0"
                                                                    value={
                                                                        quantidadesIngredientes[index] ??
                                                                        (ingrediente.qtdLiquida ? ingrediente.qtdLiquida.toString() : "")
                                                                    }
                                                                    onChange={(e) => {

                                                                        const texto = e.target.value;

                                                                        if (!/^\d*([,.]?\d*)?$/.test(texto)) {
                                                                            return;
                                                                        }

                                                                        setQuantidadesIngredientes({
                                                                            ...quantidadesIngredientes,
                                                                            [index]: texto,
                                                                        });

                                                                        const valor = Number(texto.replace(",", "."));

                                                                        const novosIngredientes = [...ingredientesProduto];

                                                                        novosIngredientes[index].qtdLiquida =
                                                                            Number.isNaN(valor) ? 0 : valor;

                                                                        setIngredientesProduto(novosIngredientes);

                                                                    }}
                                                                />

                                                            </td>

                                                            <td>
                                                                {insumoSelecionado?.unidade || "-"}
                                                            </td>

                                                            <td className="custo-cell">
                                                                {formatCurrency(custoLinha)}
                                                            </td>

                                                            <td>

                                                                <button
                                                                    className="insumo-action-btn delete"
                                                                    onClick={() => {

                                                                        const novosIngredientes = ingredientesProduto.filter(
                                                                            (_, idx) => idx !== index
                                                                        );

                                                                        setIngredientesProduto(novosIngredientes);

                                                                        setPesquisasIngredientes((anterior) => {
                                                                            const reindexado = Object.entries(anterior).reduce<Record<number, string>>(
                                                                                (acc, [chave, valor]) => {
                                                                                    const chaveNumero = Number(chave);

                                                                                    if (chaveNumero === index) {
                                                                                        return acc;
                                                                                    }

                                                                                    acc[chaveNumero > index ? chaveNumero - 1 : chaveNumero] = valor;
                                                                                    return acc;
                                                                                },
                                                                                {}
                                                                            );

                                                                            return reindexado;
                                                                        });

                                                                        setInputAberto(null);

                                                                    }}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>

                                                            </td>

                                                        </tr>

                                                    );

                                                })}



                                            </tbody>

                                        </table>


                                        <button
                                            className="btn-adicionar-insumo"
                                            onClick={() =>
                                                setIngredientesProduto((anterior) => [
                                                    ...anterior,
                                                    {
                                                        insumo: "",
                                                        qtdLiquida: 0,
                                                    },
                                                ])
                                            }
                                        >
                                            + Adicionar mais insumos
                                        </button>

                                    </div>
                                </div>

                                <div className="produtos-form__actions">

                                    <button
                                        className="btn btn-secondary"
                                        onClick={limparFormulario}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        onClick={editandoId ? atualizarProduto : cadastrarProduto}
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Salvando..."
                                            : editandoId
                                                ? "Atualizar Produto"
                                                : "Salvar Produto"}
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="search-filter-container">
                <div className="input-wrapper search-wrapper">
                    <Search className="input-icon" size={18} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Barra de pesquisa"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>

                <div className="input-wrapper filter-wrapper">
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

                <button
                    className="botao-create"
                    onClick={abrirFormulario}
                >
                    Criar Produto
                </button>
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

