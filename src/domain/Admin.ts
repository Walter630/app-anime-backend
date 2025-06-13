import { randomUUID } from "crypto";

export type AdminProps = {
  id: string;
  nome: string;
  email: string;
  senha: string;
};

export class Admin {
  private constructor(private admin: AdminProps) {
    this.validador();
  }

  public static create(nome: string, email: string, senha: string): Admin {
    if (!nome || !email || !senha) {
      throw new Error("Todos os campos são obrigatórios");
    }
    if (nome.length <= 0) {
      throw new Error("Nome é obrigatório");
    }

    const emailRules = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const emailLista = ["gmail", "hotmail", "yahoo"];
    const vericar = emailLista.some((dominio) => email.includes(dominio));
    if (!emailRules.test(email) || !vericar) {
      throw new Error("Email inválido");
    }

    return new Admin({
      id: randomUUID().toString(),
      nome,
      email,
      senha,
    });
  }

  static build(props: AdminProps) {
    return new Admin(props);
  }

  // Método para validar os campos do administrador
  public validador() {
    if (!this.admin.nome || !this.admin.email || !this.admin.senha) {
      throw new Error("Todos os campos são obrigatórios");
    }
    const email = this.admin.email;
    const emailRules = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const emailLista = ["gmail", "hotmail", "yahoo"];
    const vericar = emailLista.some((dominio) => email.includes(dominio));
    if (!emailRules.test(email) || !vericar) {
      throw new Error("Email inválido");
    }
  }

  get id(): string {
    return this.admin.id;
  }

  get nome(): string {
    return this.admin.nome;
  }

  get email(): string {
    return this.admin.email;
  }

  get senha(): string {
    return this.admin.senha;
  }
}
