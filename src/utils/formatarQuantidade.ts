export const formatarQuantidade = (
    valor: number,
    unidade: string
) => {

    if (unidade === "kg") {

        if (valor >= 1000) {
            return `${valor / 1000} kg`;
        }

        return `${valor} g`;
    }

    if (unidade === "l") {

        if (valor >= 1000) {
            return `${valor / 1000} l`;
        }

        return `${valor} ml`;
    }

    return `${valor} ${unidade}`;
};