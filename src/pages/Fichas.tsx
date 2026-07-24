import { useEffect, useState } from "react";
import {
    Pencil,
    Plus,
    Search,
    Trash2,
    ClipboardList
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../services/api";
import "./fichas.css";


export function Fichas() {
    type IngredienteFicha = {
        id: number;
        pesquisa: string;
        insumo: any;
        quantidade: number;
        unidade: string;
        custo: number;
        dropdownAberto: boolean;
    };
    const [insumos, setInsumos] = useState<any[]>([]);
    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("");
    const [preco, setPreco] = useState("");
    const [fichas, setFichas] = useState<any[]>([]);

    // MODAL DELETE
    const [modalDelete, setModalDelete] = useState(false);
    const [fichaSelecionada, setFichaSelecionada] = useState<string | null>(null);

    const [modalFicha, setModalFicha] = useState(false);
    const [ingredientes, setIngredientes] = useState<IngredienteFicha[]>([]);


    useEffect(() => {
        carregarInsumos();
        carregarFichas();
    }, []);

    async function carregarInsumos() {
        const res = await api.get("/insumos");
        setInsumos(Array.isArray(res.data.data) ? res.data.data : []);
    }

    async function carregarFichas() {
        try {
            const res = await api.get("/fichas");
            setFichas(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (err: any) {
            console.error(err.response?.data);
        }
    }

    function adicionarItem() {

        setIngredientes((estadoAtual) => [

            ...estadoAtual,

            {
                id: Date.now(),
                pesquisa: "",
                insumo: null,
                quantidade: 0,
                unidade: "-",
                custo: 0,
                dropdownAberto: false,
            }

        ]);

    }

    function selecionarIngrediente(
        linhaId: number,
        insumoSelecionado: any
    ) {

        setIngredientes((estadoAtual) =>
            estadoAtual.map((item) => {

                if (item.id !== linhaId) return item;

                return {
                    ...item,
                    pesquisa: insumoSelecionado.nome,
                    insumo: insumoSelecionado,

                    unidade:
                        insumoSelecionado.unidade ||
                        insumoSelecionado.unidadeMedida ||
                        "",

                    custo:
                        item.quantidade *
                        Number(insumoSelecionado.valorUnitario || 0),

                    dropdownAberto: false,
                };

            })
        );

    }

    async function salvarFicha() {
        try {
            const ingredientesPayload = ingredientes.map((item) => ({
                insumo: item.insumo._id,
                quantidade: item.quantidade,
            }));
            await api.post("/fichas", {
                nome,
                categoria,
                preco: Number(preco.replace(",", ".")),
                ingredientes: ingredientesPayload,
            });

            alert("Ficha criada com sucesso!");

            await carregarFichas();

            setNome("");
            setCategoria("");
            setPreco("");
            setIngredientes([]);

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

    function fecharModalFicha() {

        setModalFicha(false);

        setNome("");
        setCategoria("");
        setPreco("");

        setIngredientes([]);

    }

    // CONFIRMAR DELETE
    async function confirmarDelete() {
        if (!fichaSelecionada) return;

        try {
            await api.delete(`/fichas/${fichaSelecionada}`);
            await carregarFichas();

            toast.success("Ficha deletada com sucesso!");
        } catch (error) {
            toast.error("Erro ao deletar ficha.");
        } finally {
            setModalDelete(false);
            setFichaSelecionada(null);
        }
    }

    function calcularCusto(ficha: any) {
        return (ficha.ingredientes || []).reduce((total: number, item: any) => {
            const insumoEncontrado = insumos.find((i: any) => String(i._id) === String(item.insumo));

            if (!insumoEncontrado) return total;

            const quantidade = Number(item.quantidade || item.qtdLiquida || 0);
            const valorUnitario = Number(insumoEncontrado.valorUnitario || 0);

            return total + valorUnitario * quantidade;
        }, 0);
    }

    function calcularMargem(ficha: any) {
        const preco = Number(ficha.preco || 0);
        const custo = calcularCusto(ficha);

        if (!preco) return 0;

        return ((preco - custo) / preco) * 100;
    }

    function calcularCustoModal() {
        return ingredientes.reduce((total, item) => {
            return total + item.custo;
        }, 0);
    }

    const calcularCMVModal = () => {

        const custo = calcularCustoModal();

        if (precoNumero <= 0) return 0;

        return (custo / precoNumero) * 100;

    };

    const precoNumero = Number(
        String(preco).replace(",", ".")
    ) || 0;

    const margemContribuicao = precoNumero - calcularCustoModal();

    return (
        <div className="page-container fichas-page">

            <Toaster position="top-right" />

            <div className="fichas-header">

                <div className="fichas-title">
                    <h1>
                        <ClipboardList size={30} />
                        <span>Fichas Técnicas</span>
                    </h1>

                    <p>Gerencie as fichas técnicas dos produtos.</p>
                </div>
            </div>

            <div className="fichas-toolbar">

                <div className="fichas-toolbar-left">

                    <div className="fichas-search">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Pesquisar ficha técnica..."
                        />
                    </div>

                    <select className="fichas-select">
                        <option>Todas as categorias</option>
                    </select>

                    <button
                        className="fichas-btn fichas-btn-primary"
                        type="button"
                        onClick={() => setModalFicha(true)}
                    >
                        <Plus size={18} />
                        Nova Ficha
                    </button>

                </div>

            </div>

            <div className="fichas-table-container">

                <div className="fichas-table-wrapper">

                    <table className="fichas-table">

                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Categoria</th>
                                <th>Preço</th>
                                <th>Ingredientes</th>
                                <th>Custo</th>
                                <th>Margem</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>

                            {fichas.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan={7}
                                        className="fichas-empty"
                                    >
                                        Nenhuma ficha cadastrada no momento.
                                    </td>
                                </tr>

                            ) : (

                                fichas.map((ficha: any, index: number) => (

                                    <tr key={ficha._id || index}>

                                        <td className="fichas-cell-main">
                                            <strong>{ficha.nome || "Sem nome"}</strong>
                                            <span>Ficha técnica</span>
                                        </td>

                                        <td>{ficha.categoria || "—"}</td>

                                        <td>
                                            R$ {Number(ficha.preco || 0)
                                                .toFixed(2)
                                                .replace(".", ",")}
                                        </td>

                                        <td>
                                            {(ficha.ingredientes || []).length}
                                        </td>

                                        <td>
                                            R$ {calcularCusto(ficha)
                                                .toFixed(2)
                                                .replace(".", ",")}
                                        </td>

                                        <td>
                                            {calcularMargem(ficha).toFixed(0)}%
                                        </td>

                                        <td>

                                            <div className="fichas-actions">

                                                <button
                                                    className="fichas-action-btn"
                                                    title="Editar"
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                                <button
                                                    className="fichas-action-btn fichas-action-btn-danger"
                                                    title="Excluir"
                                                    onClick={() => abrirModalDelete(ficha._id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>
                </div>
                <div className="fichas-table-footer">

                    <span>
                        Exibindo{" "}
                        <strong>{fichas.length}</strong>
                        {" de "}
                        <strong>{fichas.length}</strong>
                        {" "}
                        {fichas.length === 1 ? "ficha técnica" : "fichas técnicas"}.
                    </span>

                </div>
            </div>
            {modalFicha && (
                <div className="fichas-modal-overlay">

                    <div className="fichas-modal">

                        <div className="fichas-modal-header">

                            <div className="fichas-modal-header-info">

                                <span className="fichas-modal-tag">
                                    FICHA TÉCNICA
                                </span>

                                <h2 className="fichas-modal-title">
                                    Ficha Técnica
                                </h2>

                                <p className="fichas-modal-subtitle">
                                    Cadastro e edição da ficha técnica
                                </p>

                            </div>

                            <button
                                className="fichas-modal-close"
                                onClick={fecharModalFicha}
                            >
                                ×
                            </button>

                        </div>

                        <div className="fichas-modal-body">

                            <div className="fichas-form-fields">

                                <div className="fichas-field">

                                    <label>Nome do Ficha técnica</label>

                                    <input
                                        type="text"
                                        placeholder="Ex.: Digite aqui o nome do prato"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                    />

                                </div>

                                <div className="fichas-field">

                                    <label>Categoria</label>

                                    <input
                                        type="text"
                                        placeholder="Ex: Lanches"
                                        value={categoria}
                                        onChange={(e) => setCategoria(e.target.value)}
                                    />

                                </div>

                                <div className="fichas-field">

                                    <label>Preço de Venda</label>

                                    <input
                                        type="text"
                                        placeholder="0,00"
                                        value={preco}
                                        onChange={(e) => {
                                            const valor = e.target.value;

                                            if (!/^\d*([,.]?\d*)?$/.test(valor)) {
                                                return;
                                            }

                                            setPreco(valor);
                                        }}
                                    />

                                </div>

                            </div>

                            <div className="fichas-resumo">

                                <div className="fichas-card">

                                    <span>Custo Total</span>

                                    <strong className="text-green">
                                        {`R$ ${calcularCustoModal().toFixed(2).replace(".", ",")}`}
                                    </strong>

                                </div>

                                <div className="fichas-card">

                                    <span>CMV (%)</span>

                                    <strong className="text-yellow">
                                        {calcularCMVModal().toFixed(1)}%
                                    </strong>

                                </div>

                                <div className="fichas-card">

                                    <span>Margem de Contribuição</span>

                                    <strong className="text-green">
                                        R$ {margemContribuicao.toFixed(2).replace(".", ",")}
                                    </strong>

                                </div>

                            </div>

                            <div className="fichas-ingredientes">

                                <div className="fichas-ingredientes-scroll">

                                    <table className="fichas-table">

                                        <thead>

                                            <tr>
                                                <th>Ingrediente</th>
                                                <th>Quantidade</th>
                                                <th>Unidade</th>
                                                <th>Custo</th>
                                                <th>Ações</th>
                                            </tr>

                                        </thead>

                                        <tbody>

                                            {ingredientes.map((item) => (

                                                <tr key={item.id}>

                                                    <td>

                                                        <input
                                                            type="text"
                                                            placeholder="Pesquisar ingrediente..."
                                                            value={item.pesquisa}
                                                            className="fichas-input-ingrediente"
                                                            onChange={(e) => {

                                                                setIngredientes((lista) =>
                                                                    lista.map((ingrediente) =>
                                                                        ingrediente.id === item.id
                                                                            ? {
                                                                                ...ingrediente,
                                                                                pesquisa: e.target.value,
                                                                                dropdownAberto: true,
                                                                            }
                                                                            : ingrediente
                                                                    )
                                                                );

                                                            }}
                                                        />

                                                        {item.dropdownAberto && (

                                                            <div className="fichas-dropdown">

                                                                {insumos
                                                                    .filter((insumo: any) =>
                                                                        insumo.nome
                                                                            ?.toLowerCase()
                                                                            .includes(item.pesquisa.toLowerCase())
                                                                    )
                                                                    .map((insumo: any) => (

                                                                        <div
                                                                            key={insumo._id}
                                                                            className="fichas-dropdown-item"
                                                                            onClick={() => selecionarIngrediente(item.id, insumo)}
                                                                        >

                                                                            <span>{insumo.nome}</span>

                                                                            <span>{insumo.unidade}</span>

                                                                        </div>

                                                                    ))}

                                                            </div>

                                                        )}

                                                    </td>

                                                    <td>

                                                        <input
                                                            type="text"
                                                            value={item.quantidade === 0 ? "" : item.quantidade}
                                                            className="fichas-input-quantidade"
                                                            onChange={(e) => {

                                                                const texto = e.target.value;

                                                                // Permite apenas números, ponto e vírgula
                                                                if (!/^\d*([,.]?\d*)?$/.test(texto)) {
                                                                    return;
                                                                }

                                                                const quantidade = Number(texto.replace(",", ".")) || 0;

                                                                setIngredientes((lista) =>
                                                                    lista.map((ingrediente) => {

                                                                        if (ingrediente.id !== item.id) return ingrediente;

                                                                        const valorUnitario = Number(
                                                                            ingrediente.insumo?.valorUnitario || 0
                                                                        );

                                                                        return {
                                                                            ...ingrediente,
                                                                            quantidade,
                                                                            custo: quantidade * valorUnitario,
                                                                        };

                                                                    })
                                                                );

                                                            }}
                                                        />

                                                    </td>

                                                    <td>
                                                        {item.unidade}
                                                    </td>

                                                    <td className="fichas-custo">
                                                        R$ {item.custo.toFixed(2).replace(".", ",")}
                                                    </td>
                                                    <td>

                                                        <button
                                                            type="button"
                                                            className="fichas-action-btn fichas-action-btn-danger"
                                                            onClick={() => {
                                                                setIngredientes((lista) =>
                                                                    lista.filter((ingrediente) => ingrediente.id !== item.id)
                                                                );
                                                            }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>

                                                    </td>

                                                </tr>

                                            ))}

                                            <tr>

                                                <td colSpan={5} className="fichas-add-row">

                                                    <button
                                                        type="button"
                                                        className="fichas-add-btn"
                                                        onClick={adicionarItem}
                                                    >
                                                        <Plus size={16} />
                                                        Adicionar mais insumos
                                                    </button>

                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>

                        <div className="fichas-modal-footer">

                            <button
                                className="fichas-btn-secondary"
                                onClick={fecharModalFicha}
                            >
                                Cancelar
                            </button>
                            <button
                                className="fichas-btn-primary"
                                onClick={salvarFicha}
                            >
                                Salvar Ficha
                            </button>

                        </div>

                    </div>

                </div>
            )
            }

            {modalDelete && (
                <div className="modal-overlay">

                    <div className="modal-box">

                        <h2>Excluir ficha técnica</h2>

                        <p>
                            Tem certeza que deseja excluir esta ficha técnica?
                        </p>

                        <div className="modal-actions">

                            <button
                                className="btn btn-danger"
                                onClick={confirmarDelete}
                            >
                                Sim, excluir
                            </button>

                            <button
                                className="btn btn-cancel"
                                onClick={() => {
                                    setModalDelete(false);
                                    setFichaSelecionada(null);
                                }}
                            >
                                Cancelar
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </div >
    );
}