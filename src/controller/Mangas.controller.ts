import { plainToInstance } from "class-transformer";
import { CreateMangasDto } from "../dto/Mangas.dto";
import { MangasServices } from "../services/Mangas.services";
import { validate } from "class-validator";

export class MangasController {
    private readonly mangasServic: MangasServices;

    constructor(readonly mangasServices: MangasServices) {
        this.mangasServic = mangasServices;
    }

    public async salvar(req: any, res: any): Promise<void> {
        const dto = plainToInstance(CreateMangasDto, req.body)
        const erros = await validate(dto)

        if (erros.length > 0){
            throw new Error('Mangas esta incorreto no dto')
        }

        try{
            const result = await this.mangasServic.salvar(dto);
            if (!result) {
                res.status(400).json({ message: 'Nao foi possivel criar o manga' });
            }
            return res.status(201).json(result);
        }catch(err){
            console.log(err)
            res.status(400).json({message: 'Erro ao criar'})
        }
    }

    public async listarMangas(req: any, res: any): Promise<void> {
        const result = await this.mangasServic.listarMangas();
        res.status(200).json(result);
    }

    public async buscarMangasPorId(req: any, res: any): Promise<void> {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ message: 'ID do manga é obrigatório' });
            return;
        }
        const result = await this.mangasServic.buscarMangasPorId(id);
        res.status(200).json(result);
    }

    public async deletarManga(req: any, res: any): Promise<void> {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ message: 'ID do manga é obrigatório' });
            return;
        }
        await this.mangasServic.deletarManga(id);
        res.status(204).send();
    }

    public async atualizarManga(req: any, res: any): Promise<void> {
        const result = await this.mangasServic.atualizarManga({id: req.params.id, ...req.body});
        if (!result) {
            res.status(400).json({message: 'Nao foi possivel atualizar o manga'});
            return;
        }
        res.status(200).json(result);
    }
}