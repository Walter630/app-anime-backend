import { validarNomeAnime } from "../utils/Validation";

export type Chapter = {
    number: number;
    title: string;
    description?: string;
    image?: string;
};
export type AnimesProps = {
  id: number;
  nome: string;
  status: string;
  data_lancamento: string;
  chapters?: Chapter[];
};

export class Animes {
  private constructor(private props: AnimesProps) {
    this.validador();
  }

  public static create(nome: string, status: string, chapters?: Chapter[]) {
    if (!nome || nome.length <= 0) {
      throw new Error("Nome é obrigatório");
    }
    if (!status || status.length <= 0) {
      throw new Error("Status é obrigatório");
    }
    if (!validarNomeAnime(nome)) {
      throw new Error("Titulo incorreto");
    }
    // Se o status não for um dos valores válidos, lance um erro
    const validStatuses = [
      "assistindo",
      "completo",
      "pausado",
      "planejado",
      "dropado",
    ];
    if (!validStatuses.includes(status)) {
      throw new Error("Status inválido");
    }
    // Cria um novo anime com a data de lançamento atual

    return new Animes({
      id: 0,
      nome,
      status,
      data_lancamento: new Date().toISOString(), //ENUM('assistindo', 'completo', 'pausado', 'planejado', 'dropado') NOT NULL,
        chapters: chapters || [],
    });
  }

  static build(animeProps: AnimesProps) {
    return new Animes(animeProps);
  }

  public validador() {
    const validarNome = validarNomeAnime;
    if (!validarNome) {
      throw new Error("Titulo incorreto");
    }
  }

  public get id(): number {
    return this.props.id;
  }
  public get nome(): string {
    return this.props.nome;
  }
  public get status(): string {
    return this.props.status;
  }
  public get data_lancamento(): string {
    return this.props.data_lancamento;

  }
  public get chapters(): Chapter[] {
      return this.props.chapters || [];
  }
}
