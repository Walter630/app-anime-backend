import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator"

export interface AnimeDTOListar {
    nome: string,
    status: string,
    data_lancamento?: Date
}

export class CreateAnimeDto {
    @IsString()
    @IsNotEmpty()
    nome!: string

    @IsString()
    @IsNotEmpty()
    status!: string

    @IsDate()
    @IsOptional()
    data_lancamento?: Date
}