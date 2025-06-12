import { Api } from './api/Api';
import { MangasApi } from './api/Mangas.api';
import { AnimesApi } from './api/Animes.api';
import { UsuariosApi } from './api/Usuarios.api';
import { adminApi } from './api/Admin.api';
// Cria a instância do Api (que tem o Express por dentro)
const api = new Api()

// Adiciona as rotas do Anime
AnimesApi.build(api)
UsuariosApi.build(api)
MangasApi.build(api)
adminApi.build(api)

// Inicia o servidor na porta 3000
api.iniciar(3000)


export default api.app