
import { RowDataPacket } from "mysql2";
import { configDb } from "../database/db";
import { Animes } from "../domain/Animes";

export class AnimesDao {
    public async salvarAnime(animes: Animes): Promise<Animes> {
        const {nome, status, data_lancamento} = animes
        const [result]: any = await configDb.query('INSERT INTO animes (nome, status, data_lancamento) VALUES (?,?,?)', [animes.nome, animes.status, animes.data_lancamento])
        // O insert retorna o insertId que pode ser o id do anime criado
        const id = result.insertId
        // Retorna o anime com id atualizado
        return Animes.build({id, nome, status, data_lancamento})   
    }

    async listarAnimes(): Promise<Animes[]> {
        const [row] = await configDb.query<RowDataPacket[]>('SELECT * FROM animes')
        // Mapeia cada linha para um objeto Domain
        return row.map((linha) => Animes.build ({
            id: linha.id,
            nome: linha.nome,
            status: linha.status,
            data_lancamento: linha.data_lancamento
        }))
    }
    
    async listarPorId(id: number): Promise<Animes | null>{
        const [row] = await configDb.query<RowDataPacket[]>('SELECT * FROM animes WHERE id = ?', [id])
        if (row.length === 0) {
            return null
        }
        const rows = row[0]
        return Animes.build({
            id: rows.id,
            nome: rows.nome,
            status: rows.status,
            data_lancamento: rows.data_lancamento
        })
    }
     // Deleta anime por id, retorna resultado do banco
    async deletar(id: number): Promise<boolean> {
        await configDb.query('DELETE FROM animes WHERE id = ?', [id])
        return true
    }

    async atualizar(animes: Animes): Promise<boolean> {
        await configDb.query('UPDATE animes SET nome=?, status=?, data_lancamento=? WHERE id = ?',
            [animes.nome, animes.status, animes.data_lancamento, animes.id]
        )
        return true
    }
    
}