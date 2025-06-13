import { RowDataPacket } from "mysql2";
import { configDb } from "../database/db";
import { Mangas } from "../domain/Mangas";

export class MangasDao {
    public async criarManga(manga: Mangas): Promise<Mangas> {
        const [criar]: any = await configDb.query('INSERT INTO mangas (nome, status, descricao, data_Lancamento, imagem, capitulos) VALUES (?, ?, ?, ?, ?, ?)', 
        [
            manga.nome, manga.status, manga.descricao, manga.data_lancamento, manga.imagem, manga.capitulos
        ])
        const id = criar.insertId;
        return Mangas.build({
            id: String(id), // ou apenas id, se for string
            nome: manga.nome,
            status: manga.status,
            descricao: manga.descricao,
            imagem: manga.imagem,
            capitulos: manga.capitulos,
            data_Lancamento: manga.data_lancamento,
        });
    }

    public async listarMangas(): Promise<Mangas[] > {
        const [listar] = await configDb.query<RowDataPacket[]>('SELECT * FROM mangas')
        return listar.map((linha) => Mangas.build({
            id: linha.id,
            nome: linha.nome,
            status: linha.status,
            descricao: linha.descricao,
            imagem: linha.imagem,
            capitulos: linha.capitulos,
            data_Lancamento: linha.data_Lancamento
        }))
    }

    public async buscarMangaPorId(id: string): Promise<Mangas | null> {
        const [buscar] = await configDb.query<RowDataPacket[]>('SELECT * FROM mangas WHERE id = ?', [id])
        if (buscar.length === 0){
            return null
        }
        const rows = buscar[0]
        return Mangas.build({
            id: rows.id,
            nome: rows.nome,
            status: rows.status,
            descricao: rows.descricao,
            imagem: rows.imagem,
            capitulos: rows.capitulos,
            data_Lancamento: rows.data_Lancamento
            })
    }

    public async atualizarManga(mangas: Mangas): Promise<boolean> {
        const [atualizar]: any = await configDb.query('UPDATE mangas SET nome = ?, status = ?, descricao = ?, data_Lancamento = ?, imagem = ?, capitulos = ? WHERE id = ?', [
            mangas.nome, mangas.status, mangas.descricao, mangas.data_lancamento , mangas.imagem, mangas.capitulos, mangas.id
        ]);
        return atualizar.affectedRows > 0
    }

    public async deletarManga(id: string): Promise<boolean> {
        const [deletar]: any = await configDb.query('DELETE FROM mangas WHERE id = ?',[id])
        return deletar.affectedRows > 0
    }

    public async buscarPorNome(nome: string): Promise<Mangas | null> {
        const [buscar] = await configDb.query<RowDataPacket[]>('SELECT * FROM mangas WHERE nome = ?', [nome])
        if (buscar.length === 0){
            return null; // Não encontrado - retorno neutro, sem erro
        }
        const rows = buscar[0]
        return Mangas.build({
            id: rows.id,
            nome: rows.nome,
            status: rows.status,
            descricao: rows.descricao,
            imagem: rows.imagem,
            capitulos: rows.capitulos,
            data_Lancamento: rows.data_Lancamento
        })
    }

}