import { randomUUID } from "crypto"

export type MangasProps = {
    id: string,
    nome: string,
    status?: string,
    descricao: string,
    imagem?: string,
    capitulos: number,
    data_criacao?: string
}

export class Mangas {
    private constructor(private mangas: MangasProps) {}

    static create(nome: string, descricao: string, imagem: string, capitulos: number, status?: string, data_criacao?: string): Mangas {
        return new Mangas({
            id: randomUUID().toString(),
            nome,
            descricao,
            imagem,
            capitulos,
            data_criacao: new Date().toISOString()
        })
    }

    public static build(props: MangasProps) {
        return new Mangas(props)
    }

    public get id(): string {
        return this.mangas.id
    }
    public get nome(): string {
        return this.mangas.nome
    }
    
    public get descricao(): string {
        return this.mangas.descricao
    }
    public get imagem(): string {
        return this.mangas.imagem ? this.mangas.imagem : ''
    }
    public get capitulos(): number {
        return this.mangas.capitulos

    }
    public get data_criacao(): string {
        return this.mangas.data_criacao ? this.mangas.data_criacao : new Date().toISOString()
    }
    public get status(): string {
        return this.mangas.status ? this.mangas.status : 'ativo'
    }
}