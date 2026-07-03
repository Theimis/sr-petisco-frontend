export const converterUnidade = (
    unidade: string,
    quantidade: number
) => {

    if (unidade === "kg") {
        return quantidade * 1000;
    }

    if (unidade === "l") {
        return quantidade * 1000;
    }

    return quantidade;
};