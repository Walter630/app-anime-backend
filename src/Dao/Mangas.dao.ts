import { RowDataPacket } from "mysql2";
import { configDb } from "../database/db";
import { Mangas } from "../domain/Mangas";

export class MangasDao {
    public async criarManga(manga: Mangas): Promise<Mangas> {
        const [criar]: any = await configDb.query('INSERT INTO mangas (nome, status, descricao, data_criacao, imagem, capitulos) VALUES (?, ?, ?, ?, ?, ?)', 
        [
            manga.nome, manga.status, manga.descricao, manga.data_criacao, manga.imagem, manga.capitulos
        ])
        return criar
    }

    public async listarMangas(): Promise<Mangas[]> {
        const [listar] = await configDb.query<RowDataPacket[]>('SELECT * FROM mangas')
        return listar.map((linha) => Mangas.build({
            id: linha.id,
            nome: linha.nome,
            status: linha.status,
            descricao: linha.descricao,
            imagem: linha.imagem,
            capitulos: linha.capitulos,
            data_criacao: linha.data_criacao
        }))
    }

    public async buscarMangaPorId(id: string): Promise<Mangas> {
        const [buscar] = await configDb.query<RowDataPacket[]>('SELECT * FROM mangas WHERE id = ?', [id])
        const rows = buscar[0]
        return Mangas.build({
            id: rows.id,
            nome: rows.nome,
            status: rows.status,
            descricao: rows.descricao,
            imagem: rows.imagem,
            capitulos: rows.capitulos,
            data_criacao: rows.data_criacao
            })
    }

    public async atualizarManga(mangas: Mangas): Promise<boolean> {
        const [atualizar]: any = await configDb.query('UPDATE mangas SET nome = ?, status = ?, descricao = ?, data_criacao = ?, imagem = ?, capitulos = ? WHERE id = ?', [
            mangas.nome, mangas.status, mangas.descricao, mangas.data_criacao , mangas.imagem, mangas.capitulos, mangas.id
        ]);
        return atualizar.affectedRows > 0
    }

    public async deletarManga(id: string): Promise<boolean> {
        const [deletar]: any = await configDb.query('DELETE FROM mangas WHERE id = ?',[id])
        return deletar.affectedRows > 0
    }

}