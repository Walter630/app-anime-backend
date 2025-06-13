import { IsNotEmpty, IsString } from "class-validator";

export interface AdminDtoListar {
  id: string;
  nome: string;
  email: string;
}

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  senha!: string;
}
