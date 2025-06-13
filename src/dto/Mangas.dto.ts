import { Type } from "class-transformer";
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export interface MangasDtoListar {
  nome: string;
  status?: string;
  data_lancamento?: string;
  descricao: string;
  imagem: string;
  capitulos: number;
}

export class CreateMangasDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsString()
  @IsOptional()
  status?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  data_lancamento?: Date;

  @IsString()
  @IsNotEmpty()
  descricao!: string;

  @IsString()
  imagem!: string;

  @IsNumber()
  capitulos!: number;
}
