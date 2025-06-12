import { validarNomeAnime } from "../utils/Validation"

export type AnimesProps = {
    id: number,
    nome: string,
    status: string,
    data_lancamento: string
}

export class Animes {
    private constructor(private props: AnimesProps){
        this.validador()
    }

    public static create(nome: string, status: string){
        return new Animes({
            id: 0,
            nome,
            status,
            data_lancamento: new Date().toISOString() //ENUM('assistindo', 'completo', 'pausado', 'planejado', 'dropado') NOT NULL,
        })
    }

    static build(animeProps: AnimesProps){
        return new Animes(animeProps)
    }

    public validador() {
        const validarNome = validarNomeAnime;
        if (!validarNome){
            throw new Error('Titulo incorreto')
        }
    }

    public get id(): number{
        return this.props.id
    }
    public get nome(): string{
        return this.props.nome
    }
    public get status(): string{
        return this.props.status
    }
    public get data_lancamento(): string{
        return this.props.data_lancamento
    }
}