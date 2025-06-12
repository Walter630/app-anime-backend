import { Response, Request } from 'express';
import { AnimeServices } from './../services/Animes.services';
import { CreateAnimeDto } from '../dto/Animes.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class AnimesController {
    private animeServices: AnimeServices;

    constructor(animeServices: AnimeServices){
        this.animeServices = animeServices;
    }

    public salvar = async(req: Request, res: Response) => {
        const dto = plainToInstance(CreateAnimeDto, req.body)
        const erros = await validate(dto)

        if (erros.length > 0){
            throw new Error('voce possui erros no DTOAnime')
        }

        try{
            const result = await this.animeServices.criarAnime(dto)
            res.status(201).json(result)
        }catch(err: any){
            console.log(err.message)
        }
    }

    public listar = async(req: Request, res: Response) => {
        try{
            const result = await this.animeServices.listarAnimes()
            res.status(200).json(result)
        }catch (err){
            res.status(401).json({message: err})
        }
    }

    public buscarPorId = async(req: Request, res: Response) => {
        try{
            const anime = await this.animeServices.listarPorId(Number(req.params.id))
            if (!anime?.id) { 
                res.status(400).json({message: 'Nao foi encontrado'})
                 return;
                }
            res.status(200).json(anime)
        }catch (err){
            res.status(400).json({message: err})
        }
    }

    public deletar =  async(req: Request, res: Response) => {
        try{
            const result = await this.animeServices.deletar(Number(req.params.id))
            if (!result) res.status(400).json({message: 'Nao foi possivel deletar'})
            res.status(200).json(result)
        }catch (err){
            res.status(400).json({message: 'Anime deletado com sucesso'})
        }
    }

    public atualizar = async(req: Request, res: Response) => {
        try{
            const result = await this.animeServices.atualizar({id: Number(req.params.id), ...req.body})
            res.status(201).json(result)
        }catch (err) {
            res.status(400).json({message: err})
        }
    }
        
}