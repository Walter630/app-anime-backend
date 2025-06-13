import { MangasDao } from "../Dao/Mangas.dao";
import { Mangas } from "../domain/Mangas";
import { CreateMangasDto, MangasDtoListar } from "../dto/Mangas.dto";

export class MangasServices {
  private mangaDao: MangasDao;

  constructor(readonly mangasDao: MangasDao) {
    this.mangaDao = mangasDao;
  }
  public async salvar(dto: CreateMangasDto): Promise<Mangas> {
    if (!dto.nome || !dto.descricao) {
      throw new Error("Nome ou descricao incompletas");
    }
    const mangasExistente = await this.mangasDao.buscarPorNome(dto.nome);
    if (mangasExistente) {
      throw new Error("Manga com este nome já existe.");
    }
    if (!dto.data_lancamento) {
      dto.data_lancamento = new Date();
    }
    const mangas = Mangas.create(
      dto.nome,
      dto.imagem,
      dto.descricao,
      dto.capitulos,
      dto.status,
      dto.data_lancamento?.toDateString(),
    );
    return await this.mangaDao.criarManga(mangas);
  }

  public async listarMangas(): Promise<MangasDtoListar[] | null> {
    const dtoMangas: MangasDtoListar[] | null =
      await this.mangaDao.listarMangas();
    if (!dtoMangas) {
      return null;
    }
    return dtoMangas;
  }

  public async buscarMangasPorId(id: string): Promise<Mangas> {
    const result = await this.mangaDao.buscarMangaPorId(id);
    return result as Mangas;
  }

  public async deletarManga(id: string): Promise<void> {
    await this.mangaDao.deletarManga(id);
  }

  public async atualizarManga(mangas: Mangas): Promise<boolean> {
    const [result]: any = await this.mangaDao.atualizarManga(mangas);
    return result as boolean;
  }
}
