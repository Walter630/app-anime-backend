import { plainToInstance } from "class-transformer";
import { CreateAdminDto } from "../dto/Admin.dto";
import { AdminServices } from "../services/Admin.services";
import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";

export class AdminController {
  private readonly adminServic: AdminServices;

  constructor(readonly adminService: AdminServices) {
    this.adminServic = adminService;
  }

  async cadastrar(req: Request, res: Response) {
    const dto = plainToInstance(CreateAdminDto, req.body);
    const erros = await validate(dto);

    if (erros.length > 0) {
      throw new Error("Opa parceiro, esta com erros no dto");
    }

    try {
      const admin = await this.adminServic.cadastrarAdmin(dto);
      res.status(201).json(admin);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Erro ao cadastrar administrador" });
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, senha } = req.body;
      const admin = await this.adminServic.loginAdmin(email, senha);
      if (!admin) {
        res.status(401).json({ message: "Email ou senha inválidos" });
        return;
      }
      res.status(200).json(admin);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Erro ao fazer login" });
    }
    next();
  }

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await this.adminServic.listar();
      res.status(200).json(admins);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Erro ao listar administradores" });
    }
  }

  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await this.adminServic.buscarPorId(req.params.id);
      res.status(200).json(admins);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Erro ao buscar administrador por id" });
    }
  }

  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await this.adminServic.atualizarAdmin(req.body);
      res.status(200).json(admins);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Erro ao atualizar administrador" });
    }
  }

  async deletar(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await this.adminServic.deletarAdmin(req.params.id);
      res.status(200).json(admins);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Erro ao deletar administrador" });
    }
  }
}
