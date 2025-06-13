import { RowDataPacket } from "mysql2";
import { configDb } from "../database/db";
import { Usuarios } from "../domain/Usuarios";

export class UsuariosDao {
  public async salvar(usuarios: Usuarios): Promise<Usuarios> {
    try {
      const { nome, email, senha } = usuarios;
      const [result]: any = await configDb.query(
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
        [usuarios.nome, usuarios.email, usuarios.senha],
      );
      const id = result.insertId;
      return Usuarios.build({ id, nome, email, senha });
    } catch (err) {
      console.log(err);
      throw new Error("Erro ao salvar usuário");
      // Retorna erro caso ocorra
    }
  }

  public async listar(): Promise<Usuarios[]> {
    try {
      const [result] = await configDb.query<RowDataPacket[]>(
        "SELECT * FROM usuarios",
      );
      return result.map((linha) =>
        Usuarios.build({
          id: linha.id,
          nome: linha.nome,
          email: linha.email,
          senha: linha.senha,
        }),
      );
    } catch (err) {
      console.error("Erro ao listar usuários:", err);
      return [];
    }
  }

  public async buscarPorIdUsuario(id: string): Promise<Usuarios | null> {
    try {
      const [result] = await configDb.query<RowDataPacket[]>(
        "SELECT * FROM usuarios WHERE id = ?",
        [id],
      );
      if (result.length == 0) return null;
      const row = result[0];
      return Usuarios.build({
        id: row.id,
        nome: row.nome,
        email: row.email,
        senha: row.senha,
      });
    } catch (err) {
      console.error("Erro ao buscar usuário por ID:", err);
      return null;
    }
  }

  public async deletarUsuario(id: string): Promise<boolean> {
    try {
      const [result]: any = await configDb.query(
        "DELETE FROM usuarios WHERE id = ?",
        [id],
      );
      return result.affectedRows > 0;
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      return false; // Retorna false em caso de erro
    }
  }

  public async AtualizarUsuario(usuarios: Usuarios): Promise<boolean> {
    try {
      if (!usuarios.id) {
        throw new Error("ID do usuário é obrigatório");
      }
      const [result]: any = await configDb.query(
        "UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?",
        [usuarios.nome, usuarios.email, usuarios.senha, usuarios.id],
      );
      return result.affectedRows > 0;
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      return false; // Retorna false em caso de erro
    }
  }

  public async buscarPorEmail(email: string): Promise<Usuarios | null> {
    try {
      const [result] = await configDb.query<RowDataPacket[]>(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
      );
      // 1. Verificar se algum resultado foi retornado
      if (!result || result.length === 0) {
        console.log(
          `[UsuariosDao] Usuário com email "${email}" não encontrado.`,
        );
        return null; // Retorna null se o usuário não for encontrado
      }
      const row = result[0];
      return Usuarios.build({
        id: row.id,
        nome: row.nome,
        email: row.email,
        senha: row.senha,
      });
    } catch (err) {
      console.error("Erro ao buscar usuário por email:", err);
      return null; // Retorna null em caso de erro
    }
  }
}
