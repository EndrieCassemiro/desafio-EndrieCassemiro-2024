const recintos = [
    { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'macaco', quantidade: 3 }] },
    { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
    { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'gazela', quantidade: 1 }] },
    { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
    { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'leao', quantidade: 1 }] }
];

const animais = {
    leao: { tamanho: 3, biomas: ['savana'], carnivoro: true },
    leopardo: { tamanho: 2, biomas: ['savana'], carnivoro: true },
    crocodilo: { tamanho: 3, biomas: ['rio'], carnivoro: true },
    macaco: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
    gazela: { tamanho: 2, biomas: ['savana'], carnivoro: false },
    hipopotamo: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
};

// Função para verificar se o bioma é compatível
function biomaCompativel(biomaRecinto, biomasAnimal) {
    return biomasAnimal.includes(biomaRecinto);
}

// Função para verificar se as regras de convivência são respeitadas
function verificaConvivencia(recinto, especie, quantidade) {
    const animalInfo = animais[especie];

    // Verificar se o recinto já possui animais carnívoros e se eles são da mesma espécie
    for (let animal of recinto.animais) {
        const infoAnimalExistente = animais[animal.especie];
        if (infoAnimalExistente.carnivoro && infoAnimalExistente.especie !== especie) {
            return false;
        }
    }

    // Verificar se o recinto já está ocupado por herbívoros ou outros animais
    if (animalInfo.carnivoro && recinto.animais.length > 0) {
        return false;
    }

    // Verificar a regra específica dos hipopótamos
    if (especie === 'hipopotamo' && recinto.bioma !== 'savana e rio') {
        return false;
    }

    return true;
}

// Função principal para encontrar os recintos viáveis
function encontrarRecintos(especie, quantidade) {
    if (!animais[especie]) {
        return "Animal inválido";
    }
    if (quantidade <= 0 || !Number.isInteger(quantidade)) {
        return "Quantidade inválida";
    }

    const animalInfo = animais[especie];
    const recintosViaveis = [];

    for (let recinto of recintos) {
        if (!biomaCompativel(recinto.bioma, animalInfo.biomas)) {
            continue;
        }

        if (!verificaConvivencia(recinto, especie, quantidade)) {
            continue;
        }

        // Calcular o espaço disponível no recinto
        let espacoOcupado = recinto.animais.reduce((total, animal) => {
            return total + animal.quantidade * animais[animal.especie].tamanho;
        }, 0);

        if (recinto.animais.length > 0 && recinto.animais.some(a => a.especie !== especie)) {
            espacoOcupado += 1; // Espaço extra para convivência de múltiplas espécies
        }

        const espacoLivre = recinto.tamanho - espacoOcupado - (animalInfo.tamanho * quantidade);
        if (espacoLivre >= 0) {
            recintosViaveis.push(`Recinto nro ${recinto.numero} (espaço livre: ${espacoLivre}, total: ${recinto.tamanho})`);
        }
    }

    if (recintosViaveis.length === 0) {
        return "Não há recinto viável";
    }

    return recintosViaveis;
}

// Exemplo de uso:
console.log(encontrarRecintos('leao', 1)); // Deve listar o recinto 5
console.log(encontrarRecintos('macaco', 2)); // Deve listar recintos 1 e 2
console.log(encontrarRecintos('hipopotamo', 1)); // Deve listar o recinto 3
console.log(encontrarRecintos('gato', 1)); // Deve retornar "Animal inválido"
