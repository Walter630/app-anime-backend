import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export interface UsuarioDtoListar {
  nome: string;
  email: string;
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
