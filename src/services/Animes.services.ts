import { AnimesDao } from "../Dao/animes.dao";
import { Animes, AnimesProps } from "../domain/Animes";
import { CreateAnimeDto } from "../dto/Animes.dto";

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

    // src/services/Animes.services.ts

    public async listarPorId(id: number) {
        const result = await this.animesDao.listarPorId(id);
        if (!result) return null;

        // Se chapters for string, parseia (caso esteja armazenado como TEXT)
        if (typeof result.chapters === 'string') {
            try {
                result.chapters = JSON.parse(result.chapters);
            } catch (e) {
                result.chapters = [];
            }
        }

        return Animes.build(result); // 👈 Agora Animes aceita chapters
    }

  public async deletar(id: number) {
    return await this.animesDao.deletar(id);
  }

  public async atualizar(animes: Animes) {
    return await this.animesDao.atualizar(animes);
  }
}
