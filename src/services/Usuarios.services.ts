import { hash } from "crypto";
import { UsuariosDao } from "../Dao/Usuarios.dao";
import { Usuarios } from "../domain/Usuarios";
import { CreateUsuarioDto, UsuarioDtoListar } from "../dto/Usuarios.dto";
import * as bcrypt from "bcrypt";

export class UsuariosServices {
  private usuariosDao: UsuariosDao;
  private readonly COUNT_ROUNDS = 10;

  constructor(readonly usuarioDao: UsuariosDao) {
    this.usuariosDao = usuarioDao;
  }
  public salvar = async (usuariosDto: CreateUsuarioDto) => {
    if (!usuariosDto.nome) {
      console.log("Nome obrigatorio");
    }
    if (!usuariosDto.email) {
      throw new Error("Email obrigatorio");
    }
    const existeEmail = await this.usuarioDao.buscarPorEmai(usuariosDto.email);
    if (existeEmail) {
      throw new Error("Usuário com este email já existe.");
    }
    // 2. Gerar o hash da senha
    // bcrypt.hash(senhaEmTextoPuro, saltRounds)
    const senhaCriptografada = await bcrypt.hash(
      usuariosDto.senha,
      this.COUNT_ROUNDS,
    );

    const usuario = Usuarios.create(
      usuariosDto.nome,
      usuariosDto.email,
      senhaCriptografada,
    );
    return await this.usuariosDao.salvar(usuario);
  };

  public async loginUsuario(
    email: string,
    senha: string,
  ): Promise<Omit<Usuarios, "senha"> | null> {
    const user = await this.usuarioDao.buscarPorEmai(email);
    if (!user) return null;

    const compareSenha = await bcrypt.compare(senha, user.senha);
    if (compareSenha) {
      // Login bem-sucedido. Retorne o usuário, mas remova a senha por segurança.
      const { senha: _, ...usuarioCompleto } = user;
      return usuarioCompleto as Omit<Usuarios, "senha">;
    } else {
      return null;
    }
  }

  public async listar(): Promise<UsuarioDtoListar[] | null> {
    const dtoUsuarios: UsuarioDtoListar[] | null =
      await this.usuariosDao.listar();
    if (!dtoUsuarios || dtoUsuarios.length === 0) {
      return null;
    }
    return dtoUsuarios.map((linha) =>
      Usuarios.build({
        nome: linha.nome,
        email: linha.email,
        id: "",
        senha: "",
      }),
    );
  }

  public async buscarPorIdUser(id: string): Promise<Usuarios | null> {
    const usuario = await this.usuariosDao.buscarPorIdUsuario(id);
    return usuario || null;
  }

  public async deletarUser(id: string): Promise<boolean> {
    try {
      await this.usuariosDao.deletarUsuario(id);
      return true;
    } catch (err) {
      return false;
    }
  }

  public async atualizarUser(usuarios: Usuarios): Promise<boolean> {
    try {
      // Busca o usuário atual no banco
      const usuarioExistente = await this.usuariosDao.buscarPorIdUsuario(
        usuarios.id,
      );
      if (!usuarioExistente) throw new Error("Usuário não encontrado.");

      // Se a senha foi enviada e é diferente da atual, criptografa
      if (
        usuarios.senha &&
        !(await bcrypt.compare(usuarios.senha, usuarioExistente.senha))
      ) {
        const senhaCript = await bcrypt.hash(usuarios.senha, this.COUNT_ROUNDS);
        usuarios.senha = senhaCript;
      } else {
        usuarios.senha = usuarioExistente.senha; // mantém a senha atual
      }
      await this.usuariosDao.AtualizarUsuario(usuarios);
      return true;
    } catch (err: any) {
      throw new Error(err);
    }
  }
}
