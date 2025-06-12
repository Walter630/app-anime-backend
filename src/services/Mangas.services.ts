
import { MangasDao } from "../Dao/Mangas.dao";
import { Mangas } from "../domain/Mangas";
import { createMangasDto } from "../dto/Mangas.dto";

export class MangasServices {
    private mangaDao: MangasDao;

    constructor(readonly mangasDao: MangasDao) {
        this.mangaDao = mangasDao;
    }
    public async salvar(dto: createMangasDto): Promise<Mangas> {
        const mangas = Mangas.create(dto.nome, dto.imagem, dto.descricao, dto.capitulos);
        await this.mangaDao.criarManga(mangas);
        return mangas;
    }
    public async listarMangas() {
        await this.mangaDao.listarMangas();
    }
    public async buscarMangasPorId(id: string): Promise<Mangas> {
        const [result]: any = await this.mangaDao.buscarMangaPorId(id);
        return result;
    }

    public async deletarManga(id: string): Promise<void> {
        await this.mangaDao.deletarManga(id);
    }

    public async atualizarManga(mangas: Mangas): Promise<boolean> {
        const [result]: any = await this.mangaDao.atualizarManga(mangas);
        return result as boolean;
    }
}
