import { randomUUID } from "crypto";

export type MangasProps = {
  id: string;
  nome: string;
  status?: string;
  descricao: string;
  imagem?: string;
  capitulos: number;
  data_Lancamento?: string;
};

export class Mangas {
  private constructor(private mangas: MangasProps) {}

  static create(
    nome: string,
    descricao: string,
    imagem: string,
    capitulos: number,
    status?: string,
    data_lancamento?: string,
  ): Mangas {
    if (!nome || nome.length <= 0) {
      throw new Error("Nome é obrigatório");
    }
    if (!descricao || descricao.length <= 0) {
      throw new Error("Descrição é obrigatória");
    }
    if (capitulos < 0) {
      throw new Error("Capítulos não pode ser negativo");
    }
    if (status && !["ativo", "inativo"].includes(status)) {
      throw new Error("Status inválido, deve ser 'ativo' ou 'inativo'");
    }
    if (data_lancamento && isNaN(Date.parse(data_lancamento))) {
      throw new Error("Data de lançamento inválida");
    }
    // Se a imagem não for fornecida, define como uma string vazia
    return new Mangas({
      id: randomUUID().toString(),
      nome,
      descricao,
      imagem,
      capitulos,
      data_Lancamento: new Date().toISOString(),
    });
  }

  public static build(props: MangasProps) {
    return new Mangas(props);
  }

  public get id(): string {
    return this.mangas.id;
  }
  public get nome(): string {
    return this.mangas.nome;
  }

  public get descricao(): string {
    return this.mangas.descricao;
  }
  public get imagem(): string {
    return this.mangas.imagem ? this.mangas.imagem : "";
  }
  public get capitulos(): number {
    return this.mangas.capitulos;
  }
  public get data_lancamento(): string {
    return this.mangas.data_Lancamento
      ? this.mangas.data_Lancamento
      : new Date().toISOString();
  }
  public get status(): string {
    return this.mangas.status ? this.mangas.status : "ativo";
  }
}
