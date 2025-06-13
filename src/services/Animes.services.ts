import { AnimesDao } from "../Dao/animes.dao";
import { Animes, AnimesProps } from "../domain/Animes";
import { AnimeDTOListar, CreateAnimeDto } from "../dto/Animes.dto";

export class AnimeServices {
  private animesDao: AnimesDao;

  constructor(readonly animeDao: AnimesDao) {
    this.animesDao = animeDao;
  }

  public async criarAnime(dto: CreateAnimeDto) {
    //validacao
    if (!dto.nome) {
      throw new Error("Nome é obrigatorio");
    }

    const animes = Animes.create(dto.nome, dto.status); // criação via domain

    return await this.animesDao.salvarAnime(animes);
  }

  public async listarAnimes(): Promise<AnimeDTOListar[] | null> {
    const dtoAnimes: AnimeDTOListar[] | null =
      await this.animesDao.listarAnimes();
    if (!dtoAnimes) {
      return null;
    }
    return dtoAnimes;
  }

  public async listarPorId(id: number): Promise<AnimesProps | null> {
    try {
      const anime: Animes | null = await this.animesDao.listarPorId(id);
      return anime || null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async deletar(id: number) {
    return await this.animesDao.deletar(id);
  }

  public async atualizar(animes: Animes) {
    return await this.animesDao.atualizar(animes);
  }
}
