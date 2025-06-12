import { randomUUID } from "crypto"

export type AdminProps = {
    id: string,
    nome: string,
    email: string,
    senha: string
}

export class Admin {
    private constructor(private admin: AdminProps) {}

    public static create(nome: string, email: string, senha: string): Admin {
        return new Admin({
            id: randomUUID().toString(),
            nome,
            email,
            senha
        })
    }

    static build(props: AdminProps) {
        return new Admin(props)
    }

    public validador() {
        if (!this.admin.nome || !this.admin.email || !this.admin.senha) {
            throw new Error("Todos os campos são obrigatórios")
        }
        const email = this.admin.email
        const emailRules = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
        const emailLista = ['gmail', 'hotmail', 'yahoo']
        const vericar = emailLista.some(dominio => emailLista.includes(dominio))
        if(!emailRules.test(email) || !vericar) {
            throw new Error('Email inválido')
        }
    }

    get id(): string {
        return this.admin.id
    }

    get nome(): string {
        return this.admin.nome
    }

    get email(): string {
        return this.admin.email
    }
    
    get senha(): string {
        return this.admin.senha
    }
}