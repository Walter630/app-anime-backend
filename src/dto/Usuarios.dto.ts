
import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export type UsuarioDto = {
    nome: string,
    email: string,
    senha: string
}

export class CreateUsuarioDto {
    @IsNotEmpty()
    @IsString()
    nome!: string;

    @IsNotEmpty()
    @IsString()
    email!: string;

    @IsNotEmpty()
    @IsString()
    senha!: string;

    @IsOptional()
    @IsString()
    telefone?: string;
}

