import { IsString, IsNotEmpty, IsEnum, IsOptional, ValidateNested, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class ChapterDto {
    @IsNumber()
    number: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    image?: string;
}

export class CreateAnimeDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(['assistindo', 'completo', 'pausado', 'planejado', 'dropado'])
    status: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChapterDto)
    @IsOptional()
    chapters?: ChapterDto[];
}