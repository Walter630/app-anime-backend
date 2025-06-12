export interface createMangasDto {
    id: string;
    nome: string;
    status?: string;
    data_lancamento?: string;
    descricao: string;
    imagem: string;
    capitulos: number;
}

