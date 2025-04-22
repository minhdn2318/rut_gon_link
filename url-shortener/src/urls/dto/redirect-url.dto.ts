import { IsString, IsNotEmpty } from 'class-validator';

export class RedirectUrlDto {
  @IsString()
  @IsNotEmpty()
  shortCode: string;
}