export const formatarUnidade = (
    unidade: string
) => {

    if (unidade === "kg") {
        return "g";
    }

    if (unidade === "l") {
        return "ml";
    }

    return unidade;
};