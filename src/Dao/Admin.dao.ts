import { RowDataPacket } from "mysql2";
import { configDb } from "../database/db";
import { Admin, AdminProps } from "../domain/Admin";

export class AdminDao {
  public async criarAdmin(admin: Admin): Promise<Admin | null> {
    try {
      const { nome, email, senha } = admin;
      const [result]: any = await configDb.query(
        "INSERT INTO admins (nome, email, senha) VALUES (?, ?, ?)",
        [admin.nome, admin.email, admin.senha],
      );
      const id = result.insertId;
      return Admin.build({ id: id.toString(), nome, email, senha });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async listarAdmin(): Promise<Admin[] | null> {
    try {
      const [listar]: any = await configDb.query<RowDataPacket[]>(
        "SELECT * FROM admins",
      );
      return listar.map((linha: any) =>
        Admin.build({
          id: linha.id.toString(),
          nome: linha.nome,
          email: linha.email,
          senha: linha.senha,
        }),
      );
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async buscarAdminPorId(id: string): Promise<Admin | null> {
    try {
      const [buscar] = await configDb.query<AdminProps[] & RowDataPacket[]>(
        "SELECT * FROM admins WHERE id = ?",
        [id],
      );
      if (!buscar || buscar.length === 0) {
        return null;
      }
      const rows = buscar[0];
      return Admin.build({
        id: rows.id,
        nome: rows.nome,
        email: rows.email,
        senha: rows.senha,
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async deletarAdmin(id: string): Promise<boolean> {
    try {
      const [deletado]: any = await configDb.query(
        "DELETE FROM admins WHERE id = ?",
        [id],
      );
      return deletado.affectedRows > 0;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public async atualizarAdmin(admin: Admin): Promise<boolean> {
    try {
      const [atualizado]: any = await configDb.query(
        "UPDATE admins SET nome = ?, email = ?, senha = ? WHERE id = ?",
        [admin.nome, admin.email, admin.senha, admin.id],
      );
      return atualizado.affectedRows > 0;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public async buscarPorEmail(email: string): Promise<Admin | null> {
    try {
      const [buscar] = await configDb.query<RowDataPacket[]>(
        "SELECT * FROM admins WHERE email = ?",
        [email],
      );
      if (!buscar || buscar.length === 0) {
        console.log(
          `[UsuariosDao] Usuário com email "${email}" não encontrado.`,
        );
        return null; //
      }
      const rows = buscar[0];
      return Admin.build({
        id: rows.id,
        nome: rows.nome,
        email: rows.email,
        senha: rows.senha,
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
