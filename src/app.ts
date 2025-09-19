// index.ts (ou server.ts)

import "reflect-metadata"; // deve ser o primeiro import
import dotenv from "dotenv";
import path from "path";
import express from "express"; // 👈 necessário para CORS e app.use

// Carregue o .env dentro da pasta config
dotenv.config({ path: path.resolve(__dirname, "config/.env") });

// Importe sua configuração do banco
import { configDb } from "./database/db";

// Importe suas APIs
import { Api } from "./api/Api";
import { MangasApi } from "./api/Mangas.api";
import { AnimesApi } from "./api/Animes.api";
import { UsuariosApi } from "./api/Usuarios.api";
import { adminApi } from "./api/Admin.api";

// 👇 Importe e configure o CORS
import cors from "cors";

// Cria a instância do Api (que tem o Express por dentro)
const api = new Api();

// ✅ Configuração do CORS — PERMITINDO SEU FRONTEND (localhost:5173)
api.app.use(
    cors({
        origin: "http://localhost:5173", // URL do seu frontend Vue
        credentials: true, // se usar cookies/sessões
    })
);

// ✅ Opcional: Configura JSON e URL-encoded
api.app.use(express.json());
api.app.use(express.urlencoded({ extended: true }));

// ✅ Inicializa o banco de dados (se ainda não fez)

        console.log("✅ Banco de dados conectado com sucesso!");

        // ✅ Adiciona as rotas
        AnimesApi.build(api);
        UsuariosApi.build(api);
        MangasApi.build(api);
        adminApi.build(api);

        // ✅ Inicia o servidor na porta 3000
        api.iniciar(3000);

export default api.app;