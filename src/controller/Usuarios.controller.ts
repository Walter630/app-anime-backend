import { Response, Request } from "express";
import { createUsuarioDto, mostrarUsuarioDto } from "../dto/Usuarios.dto";
import { UsuariosServices } from "../services/Usuarios.services";

export class UsuariosController {
    private usuariosServs: UsuariosServices;

    constructor(usuariosServices: UsuariosServices){
        this.usuariosServs = usuariosServices;
    }

    public salvar = async(req: Request, res: Response) => {
        try{
            console.log('Body recebido:', req.body)   // <== veja se aparece algo aqui
            const dto: createUsuarioDto = req.body
            const result = await this.usuariosServs.salvar(dto)
            res.status(201).json(result)
        }catch(err){
            console.log('ERRO AO SALVAR:', err); // 👈 Adicione isto
            res.status(500).json({message: 'Nao foi possivel criar'})
        }
    }

    public listar = async(req: Request, res: Response) => {
        try{
            const result = await this.usuariosServs.listar()
            res.status(200).json(result)
        }catch(err){
            res.status(400).json({message: 'Nao foi possivel listar'})
        }
    }

    public buscarPorId = async(req: Request, res: Response) => {
        try{
            const result = await this.usuariosServs.buscarPorIdUser(req.params.id)
            if (!result?.id) res.status(400).json({message: 'Nao foi encontrado'})
            res.status(200).json(result)
        }catch(err){
            res.status(400).json({message: 'Nao foi possivel Encontrar usuario'})
        }
    }

    public deletar = async(req: Request, res: Response) => {
        try{
            const result = await this.usuariosServs.deletarUser(req.params.id)
            if (!result) res.status(400).json({message: 'Nao foi possivel deletar'})
            res.status(200).json(result)
        }catch(err){
            res.status(400).json({message: 'Nao foi possivel deletar Usuario'})
        }
    }

    public atualizar = async(req: Request, res: Response) => {
        try{
            const result = await this.usuariosServs.atualizarUser({id: (req.params.id), ...req.body})
            res.status(200).json(result)
        }catch(err){
            res.status(400).json({message: 'Nao foi possuvel atualizar este usuario'})
        }
    }
}