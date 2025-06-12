export interface createAdminDto {
    id: string;
    nome: string;
    email: string;
    senha: string;
}

export interface mostrarAdminDto {
    id: string;
    nome: string;
    email: string;
    senha?: string;
}

export interface atualizarAdminDto {
    id: string;
    nome?: string;
    email?: string;
    senha?: string;
}

export interface deleteAdminDto {
    id: string;
}

export interface listarAdminDto {
    id: string;
    nome: string;
    email: string;
    senha?: string;
}

export interface listarAdminPorNomeDto {
    nome: string;
    email?: string;
    senha?: string;
}