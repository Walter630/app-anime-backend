import { randomUUID } from "crypto"

export type UsuarioProps = {
    id: string,
    nome: string,
    email: string,
    telefone?: string,
    senha: string
    isLogado?: boolean
}

export class Usuarios {
    private constructor(private usuario: UsuarioProps){
        this.validador()
    }

    public static create(nome: string, email: string, senha: string): Usuarios {
        return new Usuarios({
            id: randomUUID(),
            nome,
            email,
            senha,
        })
    }

    static build(props: UsuarioProps){
        return new Usuarios(props)
    }

    public validador(): void {
        if (!this.usuario.nome || this.usuario.nome.length <= 0){
            throw new Error("Nome é obrigatório")
        }
           
        const email = this.usuario.email
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
        const emailLista = ['gmail', 'hotmail', 'yahoo']
        const validar = emailLista.some(dominio => email.includes(dominio))
        if (!emailRegex.test(email) || !validar) {
            throw new Error('Email inválido')
        }

        const senha = this.usuario.senha
        const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

        if (!senhaRegex.test(senha)){
            throw new Error('Senha inválida: deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais')
        }
    }

    public get id(): string{
        return this.usuario.id 
    }

    public get nome(): string{
        return this.usuario.nome
    }

    public get email(): string{
        return this.usuario.email
    }

    public get telefone(): string | undefined{
        return this.usuario.telefone
    }

    public get senha(): string{
        return this.usuario.senha
    }

    public get isLogado(): boolean {
        return this.isLogado ?? true
    }

}