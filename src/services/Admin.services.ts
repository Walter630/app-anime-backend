import { Admin } from "./../domain/Admin";
import { AdminDtoListar, CreateAdminDto } from "../dto/Admin.dto";
import { AdminDao } from "../Dao/Admin.dao";
import * as bcrypt from "bcrypt";
import { CreateToken, RefreshToken } from "../utils/jwt";

export class AdminServices {
  private adminDao: AdminDao;
  private readonly SOUNT_ROUNDS = 10;

  constructor(readonly adminsDao: AdminDao) {
    this.adminDao = adminsDao;
  }
  public async cadastrarAdmin(admin: CreateAdminDto): Promise<Admin | null> {
    try {
      if (!admin) {
        throw new Error("Admin não encontrado");
      }
      if (!admin.email) {
        throw new Error("email não encontrado");
      }
      const senhaCriptografada = await bcrypt.hash(
        admin.senha,
        this.SOUNT_ROUNDS,
      );
      if (!senhaCriptografada) {
        throw new Error("Erro ao criptografar senha");
      }
      const result = Admin.create(admin.nome, admin.email, senhaCriptografada);
      return await this.adminDao.criarAdmin(result);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async loginAdmin(email: string, senha: string): Promise<any | null> {
    try {
      const admin = await this.adminDao.buscarPorEmail(email);
      if (!admin) {
        return null;
      }
      const senhaCriptografada = await bcrypt.compare(senha, admin.senha);
      if (!senhaCriptografada) {
        return null;
      }

      const createToken = CreateToken({ id: admin.id.toString() });
      const refreshToken = RefreshToken({ id: admin.id.toString() });

      const { senha: _, ...adminInfo } = admin;
      return {
        createToken,
        refreshToken,
        admin: adminInfo,
      };
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async listar(): Promise<AdminDtoListar[] | null> {
    try {
      const adminDto: AdminDtoListar[] | null =
        await this.adminDao.listarAdmin();
      if (!adminDto) {
        return null;
      }
      return adminDto;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async buscarPorId(id: string): Promise<Admin | null> {
    try {
      return await this.adminDao.buscarAdminPorId(id);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async atualizarAdmin(admin: Admin): Promise<boolean> {
    try {
      await this.adminDao.atualizarAdmin(admin);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public async deletarAdmin(id: string): Promise<boolean> {
    try {
      await this.adminDao.deletarAdmin(id);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
