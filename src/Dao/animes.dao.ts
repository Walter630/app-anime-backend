import { RowDataPacket } from "mysql2";
import { configDb } from "../database/db";
import { Animes } from "../domain/Animes";

export class AnimesDao {
    public async salvarAnime(animes: Animes): Promise<Animes> {
        const connection = await configDb.getConnection();
        try {
            await connection.beginTransaction();

            const { nome, status, data_lancamento, chapters = [] } = animes;

            // 1. Salva o anime
            const [result]: any = await connection.query(
                "INSERT INTO anime (nome, status, data_lancamento) VALUES (?, ?, ?)",
                [nome, status, data_lancamento]
            );

            const animeId = result.insertId;

            // 2. Salva cada capítulo
            for (const chapter of chapters) {
                await connection.query(
                    "INSERT INTO chapters (anime_id, number, title, description, image) VALUES (?, ?, ?, ?, ?)",
                    [
                        animeId,
                        chapter.number,
                        chapter.title,
                        chapter.description || null,
                        chapter.image || null
                    ]
                );
            }

            await connection.commit();

            return Animes.build({
                id: animeId,
                nome,
                status,
                data_lancamento,
                chapters
            });
        } catch (err) {
            await connection.rollback();
            console.log(err);
            throw new Error("Erro ao salvar anime");
        } finally {
            connection.release();
        }
    }
    async listarAnimes(): Promise<Animes[] | null> {
        try {
            const [animesRows] = await configDb.query<RowDataPacket[]>(
                "SELECT * FROM anime"
            );

            // Para cada anime, busca seus capítulos
            const animes = await Promise.all(
                animesRows.map(async (row) => {
                    const [chaptersRows] = await configDb.query<RowDataPacket[]>(
                        "SELECT id, number, title, description, image FROM chapters WHERE anime_id = ? ORDER BY number ASC",
                        [row.id]
                    );

                    const chapters = chaptersRows.map(ch => ({
                        number: ch.number,
                        title: ch.title,
                        description: ch.description,
                        image: ch.image
                    }));

                    return Animes.build({
                        id: row.id,
                        nome: row.nome,
                        status: row.status,
                        data_lancamento: row.data_lancamento,
                        chapters
                    });
                })
            );

            return animes;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async listarPorId(id: number): Promise<Animes | null> {
        try {
            const [animeRows] = await configDb.query<RowDataPacket[]>(
                "SELECT * FROM anime WHERE id = ?",
                [id]
            );

            if (animeRows.length === 0) {
                return null;
            }

            const animeRow = animeRows[0];

            const [chaptersRows] = await configDb.query<RowDataPacket[]>(
                "SELECT id, number, title, description, image FROM chapters WHERE anime_id = ? ORDER BY number ASC",
                [id]
            );

            const chapters = chaptersRows.map(ch => ({
                number: ch.number,
                title: ch.title,
                description: ch.description,
                image: ch.image
            }));

            return Animes.build({
                id: animeRow.id,
                nome: animeRow.nome,
                status: animeRow.status,
                data_lancamento: animeRow.data_lancamento,
                chapters
            });
        } catch (err) {
            console.log(err);
            return null;
        }
    }
  // Deleta anime por id, retorna resultado do banco
  async deletar(id: number): Promise<boolean> {
    try {
      await configDb.query("DELETE FROM animes WHERE id = ?", [id]);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async atualizar(animes: Animes): Promise<boolean> {
    try {
      // Verifica se o anime existe
      await configDb.query(
        "UPDATE animes SET nome=?, status=?, data_lancamento=? WHERE id = ?",
        [animes.nome, animes.status, animes.data_lancamento, animes.id],
      );
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
