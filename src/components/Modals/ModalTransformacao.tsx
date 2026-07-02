import "./ModalTransformacao.css";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Trash2 } from "lucide-react";
import { formatarUnidade } from "../../utils/formatarUnidade";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function ModalTransformacao({ open, onClose }: Props) {

    // ======================
    // STATES
    // ======================
    const [insumosDisponiveis, setInsumosDisponiveis] = useState<any[]>([]);
    const [insumosSelecionados, setInsumosSelecionados] = useState<any[]>([]);
    const [pesquisasTabela, setPesquisasTabela] = useState<Record<number, string>>({});


    const [modalInsumo, setModalInsumo] = useState(false);
    const [insumoSelecionado, setInsumoSelecionado] = useState<any>(null);

    const [quantidade, setQuantidade] = useState<number>(0);
    const [busca, setBusca] = useState("");

    const [dadosTransformacao, setDadosTransformacao] = useState({
        nome: "",
        unidadeFinal: "kg",
        quantidadeProduzida: ""
    });

    function normalizarProducao() {
        const valor = Number(
            (dadosTransformacao.quantidadeProduzida || "0")
                .toString()
                .replace(",", ".")
        );

        const unidade = dadosTransformacao.unidadeFinal;

        if (unidade === "kg") return valor * 1000;
        if (unidade === "l") return valor * 1000;

        return valor;
    }

    function unidadeCompativel(
        unidadeIngrediente: string,
        unidadeFinal: string
    ) {

        if (
            (unidadeFinal === "kg" || unidadeFinal === "g") &&
            (unidadeIngrediente === "kg" || unidadeIngrediente === "g")
        ) {
            return true;
        }

        if (
            (unidadeFinal === "l" || unidadeFinal === "ml") &&
            (unidadeIngrediente === "l" || unidadeIngrediente === "ml")
        ) {
            return true;
        }

        if (
            unidadeFinal === "un" &&
            unidadeIngrediente === "un"
        ) {
            return true;
        }

        return false;
    }


    function converterQuantidadeParaExibicao(
        quantidade: number,
        unidade: string
    ) {
        if (unidade === "kg") {
            return quantidade / 1000;
        }

        if (unidade === "l") {
            return quantidade / 1000;
        }

        return quantidade;
    }


    const limparModal = () => {
        setInsumosSelecionados([]);
        setPesquisasTabela({});

        setBusca("");
        setQuantidade(0);

        setInsumoSelecionado(null);

        // Depois vamos adicionar os outros campos aqui
    };

    const custoTotal = insumosSelecionados.reduce(
        (total, item) => total + Number(item.custo || 0),
        0
    );


    const quantidadeTotalInsumos = insumosSelecionados.reduce(
        (total, item) => {

            if (!unidadeCompativel(
                item.unidade,
                dadosTransformacao.unidadeFinal
            )) {
                return total;
            }

            return total + Number(item.quantidade || 0);

        },
        0
    );

    const quantidadeProduzidaBase = normalizarProducao();

    const rendimento =
        quantidadeTotalInsumos > 0
            ? (quantidadeProduzidaBase / quantidadeTotalInsumos) * 100
            : 0;

    const valorUnitario =
        quantidadeProduzidaBase > 0
            ? custoTotal / quantidadeProduzidaBase
            : 0;

    async function salvarTransformacao() {

        if (!dadosTransformacao.nome.trim()) {
            alert("Informe o nome da transformação.");
            return;
        }

        if (insumosSelecionados.length === 0) {
            alert("Adicione pelo menos um ingrediente.");
            return;
        }

        const ingredientes = insumosSelecionados.map(item => ({
            insumo: item.insumoId,
            qtdLiquida: item.quantidade
        }));

        const body = {
            nome: dadosTransformacao.nome,
            categoria: "Transformados",
            unidade: dadosTransformacao.unidadeFinal,
            rendimento: Number(
                dadosTransformacao.quantidadeProduzida.toString().replace(",", ".")
            ),
            ingredientes
        };

        try {

            await api.post("/transformados", body);

            alert("Transformação salva com sucesso!");

            limparModal();

            onClose();

        } catch (error) {

            console.error(error);

            alert("Erro ao salvar transformação.");

        }
    }

    useEffect(() => {
        async function load() {
            const res = await api.get("/insumos");
            setInsumosDisponiveis(res.data.data || []);
        }

        load();
    }, []);

    if (!open) return null;

    return (
        <div className="transformacao-overlay">
            <div className="transformacao-modal">

                {/* HEADER */}
                <div className="transformacao-header">
                    <div className="transformacao-header-text">

                        <h2>Criar Transformação</h2>

                        <p className="transformacao-subtitle">
                            Monte sua transformação utilizando os insumos cadastrados.
                        </p>

                    </div>

                    <button className="modal-close" onClick={() => {
                        limparModal();
                        onClose();
                    }}>
                        ×
                    </button>
                </div>

                {/* CONTENT */}
                <div className="modal-content transformacao-content">

                    {/* FORM */}
                    <div className="transformacao-grid">
                        <div className="transformacao-field">
                            <label>Nome da transformação</label>

                            <input
                                className="transformacao-input"
                                placeholder="Ex.: Recheio de Frango Temperado"
                                value={dadosTransformacao.nome}
                                onChange={(e) =>
                                    setDadosTransformacao({
                                        ...dadosTransformacao,
                                        nome: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="transformacao-field">
                            <label>Unidade final</label>
                            <select
                                className="transformacao-select"
                                value={dadosTransformacao.unidadeFinal}
                                onChange={(e) =>
                                    setDadosTransformacao({
                                        ...dadosTransformacao,
                                        unidadeFinal: e.target.value
                                    })
                                }
                            >
                                <option value="kg">kg</option>
                                <option value="g">g</option>
                                <option value="l">l</option>
                                <option value="ml">ml</option>
                                <option value="un">un</option>
                            </select>
                        </div>

                        <div className="transformacao-field">
                            <label>Quantidade produzida</label>
                            <input
                                type="text"
                                className="transformacao-input"
                                placeholder="0,00"
                                value={dadosTransformacao.quantidadeProduzida}
                                onChange={(e) =>
                                    setDadosTransformacao({
                                        ...dadosTransformacao,
                                        quantidadeProduzida: e.target.value
                                    })
                                }
                            />
                        </div>

                    </div>

                    {/* RESULTADO */}
                    <h3 className="transformacao-section-title">
                        Resultado da transformação
                    </h3>

                    <div className="transformacao-cards-container">

                        <div className="transformacao-card">
                            <span>Rendimento</span>

                            <strong>
                                {rendimento.toFixed(1).replace(".", ",")}%
                            </strong>

                            <small>
                                {converterQuantidadeParaExibicao(
                                    quantidadeProduzidaBase,
                                    dadosTransformacao.unidadeFinal
                                )
                                    .toFixed(3)
                                    .replace(".", ",")}
                                {dadosTransformacao.unidadeFinal}

                                {" de "}

                                {converterQuantidadeParaExibicao(
                                    quantidadeTotalInsumos,
                                    dadosTransformacao.unidadeFinal
                                )
                                    .toFixed(3)
                                    .replace(".", ",")}
                                {dadosTransformacao.unidadeFinal}
                            </small>
                        </div>

                        <div className="transformacao-card">
                            <span>Custo total</span>
                            <strong>
                                R$ {custoTotal.toFixed(2).replace(".", ",")}
                            </strong>

                            <small>Custo para produzir</small>
                        </div>

                        <div className="transformacao-card">
                            <span>Valor unitário</span>
                            <strong>
                                R$ {valorUnitario.toFixed(2).replace(".", ",")} /{dadosTransformacao.unidadeFinal}
                            </strong>
                            <small>Custo por unidade final</small>
                        </div>

                    </div>

                    {/* TABELA */}
                    <h3 className="transformacao-section-title">
                        Insumos utilizados
                    </h3>

                    <div className="modal-ingredients-section">

                        {/* Cabeçalho */}
                        <div className="modal-ingredients-header">
                            <span>Insumo</span>
                            <span style={{ textAlign: "center" }}>Quantidade</span>
                            <span style={{ textAlign: "center" }}>Unidade</span>
                            <span style={{ textAlign: "center" }}>Custo</span>
                            <span style={{ textAlign: "center" }}>Ação</span>
                        </div>

                        {/* Lista */}
                        <div className="modal-ingredients-scroll">

                            {insumosSelecionados.map((item, index) => {

                                const resultadosPesquisa = insumosDisponiveis
                                    .filter((insumo) =>
                                        insumo.nome
                                            .toLowerCase()
                                            .includes((pesquisasTabela[index] || "").toLowerCase())
                                    )
                                    .slice(0, 10);

                                return (
                                    <div className="modal-ingredient-row" key={item.tempId || index}>

                                        {/* =========================
                                    MODO PESQUISA (linha nova)
                                    ========================= */}
                                        {item.pesquisando ? (
                                            <>
                                                {/* PESQUISA */}
                                                <div className="busca-wrapper" style={{ position: "relative" }}>
                                                    <input
                                                        type="text"
                                                        placeholder="🔍 Pesquisar ingrediente..."
                                                        value={pesquisasTabela[index] || ""}
                                                        onChange={(e) => {
                                                            setPesquisasTabela({
                                                                ...pesquisasTabela,
                                                                [index]: e.target.value
                                                            });
                                                        }}
                                                        className="transformacao-input"
                                                    />

                                                    {(pesquisasTabela[index] || "").length > 0 && (
                                                        <div
                                                            style={{
                                                                position: "absolute",
                                                                top: "100%",
                                                                left: 0,
                                                                right: 0,
                                                                background: "#121828",
                                                                border: "1px solid #232F4A",
                                                                borderRadius: 10,
                                                                maxHeight: 220,
                                                                overflowY: "auto",
                                                                zIndex: 9999,
                                                                boxShadow: "0 10px 30px rgba(0,0,0,.45)"
                                                            }}
                                                        >
                                                            {resultadosPesquisa.map((insumo) => (
                                                                <div
                                                                    key={insumo._id}
                                                                    style={{
                                                                        padding: 10,
                                                                        cursor: "pointer",
                                                                        borderBottom: "1px solid #232F4A"
                                                                    }}
                                                                    onClick={() => {
                                                                        const lista = [...insumosSelecionados];
                                                                        lista[index] = {
                                                                            ...lista[index],
                                                                            insumoId: insumo._id,
                                                                            nome: insumo.nome,
                                                                            unidade: insumo.unidade,
                                                                            valorUnitario: insumo.valorUnitario,
                                                                            pesquisando: false
                                                                        };

                                                                        setInsumosSelecionados(lista);
                                                                        setPesquisasTabela((prev) => {
                                                                            const novo = { ...prev };
                                                                            delete novo[index];
                                                                            return novo;
                                                                        });
                                                                    }}
                                                                >
                                                                    {insumo.nome}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* QUANTIDADE */}
                                                <div style={{ textAlign: "center" }}>
                                                    <input
                                                        type="number"
                                                        value={item.quantidade}
                                                        onChange={(e) => {
                                                            const lista = [...insumosSelecionados];
                                                            lista[index].quantidade = Number(e.target.value);
                                                            lista[index].custo =
                                                                Number(e.target.value) * Number(lista[index].valorUnitario);

                                                            setInsumosSelecionados(lista);
                                                        }}
                                                        className="transformacao-input"
                                                        style={{ width: 90, textAlign: "center" }}
                                                    />
                                                </div>

                                                {/* UNIDADE */}
                                                <span style={{ textAlign: "center" }}>
                                                    {item.unidade
                                                        ? formatarUnidade(item.unidade)
                                                        : "-"}
                                                </span>

                                                {/* CUSTO */}
                                                <span style={{ textAlign: "center", color: "#10b981", fontWeight: 700 }}>
                                                    R$ {(item.custo || 0).toFixed(2).replace(".", ",")}
                                                </span>

                                                {/* LIXEIRA (CANCELA LINHA INTEIRA) */}
                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                    <button
                                                        className="insumo-action-btn delete"
                                                        onClick={() => {
                                                            setInsumosSelecionados(prev =>
                                                                prev.filter((_, i) => i !== index)
                                                            );
                                                        }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {/* =========================
                                             MODO NORMAL (linha pronta)
                                             ========================= */}

                                                <span>{item.nome}</span>

                                                <div style={{ textAlign: "center" }}>
                                                    <input
                                                        type="number"
                                                        value={item.quantidade}
                                                        onChange={(e) => {
                                                            const lista = [...insumosSelecionados];
                                                            lista[index].quantidade = Number(e.target.value);
                                                            lista[index].custo =
                                                                Number(e.target.value) * Number(item.valorUnitario);

                                                            setInsumosSelecionados(lista);
                                                        }}
                                                        className="transformacao-input"
                                                        style={{ width: 90, textAlign: "center" }}
                                                    />
                                                </div>

                                                <span style={{ textAlign: "center" }}>
                                                    {formatarUnidade(item.unidade)}
                                                </span>

                                                <span style={{ textAlign: "center", color: "#10b981", fontWeight: 700 }}>
                                                    R$ {item.custo.toFixed(2).replace(".", ",")}
                                                </span>

                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                    <button
                                                        className="insumo-action-btn delete"
                                                        onClick={() => {
                                                            setInsumosSelecionados(prev =>
                                                                prev.filter((_, i) => i !== index)
                                                            );
                                                        }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}


                            <div
                                style={{
                                    padding: 14,
                                    display: "flex",
                                    justifyContent: "center"
                                }}
                            >

                                <button
                                    className="modal-add-ingredient-btn"
                                    onClick={() => {
                                        setInsumosSelecionados(prev => [
                                            ...prev,
                                            {
                                                tempId: Date.now(),
                                                insumoId: "",
                                                nome: "",
                                                unidade: "",
                                                valorUnitario: 0,
                                                quantidade: 0,
                                                custo: 0,
                                                pesquisando: true
                                            }
                                        ]);
                                    }}
                                >
                                    + Adicionar insumo
                                </button>

                            </div>

                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer">

                        <button className="modal-footer-btn cancel" onClick={() => {
                            limparModal();
                            onClose();
                        }}>
                            Cancelar
                        </button>

                        <button className="modal-footer-btn save" onClick={salvarTransformacao}>
                            Salvar transformação
                        </button>

                    </div>

                    {modalInsumo && (
                        <div className="modal-overlay">
                            <div className="modal-box">

                                <h3>Selecionar insumo</h3>

                                {/* 🔎 BUSCA */}
                                <input
                                    placeholder="Digite para buscar..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                />

                                {/* 📃 RESULTADOS FILTRADOS */}
                                <div style={{ marginTop: 10 }}>
                                    {insumosDisponiveis
                                        .filter((insumo) =>
                                            insumo.nome
                                                .toLowerCase()
                                                .includes(busca.toLowerCase())
                                        )
                                        .slice(0, 8) // opcional: limita resultados
                                        .map((insumo) => (
                                            <div
                                                key={insumo._id}
                                                onClick={() => setInsumoSelecionado(insumo)}
                                                style={{
                                                    padding: "10px",
                                                    cursor: "pointer",
                                                    borderBottom: "1px solid #1f2937",
                                                    background:
                                                        insumoSelecionado?._id === insumo._id
                                                            ? "#1e293b"
                                                            : "transparent",
                                                }}
                                            >
                                                {insumo.nome}
                                            </div>
                                        ))}
                                </div>

                                {/* QUANTIDADE */}
                                <input
                                    style={{ marginTop: 10 }}
                                    type="number"
                                    placeholder="Quantidade"
                                    value={quantidade}
                                    onChange={(e) =>
                                        setQuantidade(Number(e.target.value))
                                    }
                                />

                                {/* BOTÕES */}
                                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>

                                    <button onClick={() => setModalInsumo(false)}>
                                        Cancelar
                                    </button>


                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}