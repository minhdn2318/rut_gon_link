import { IsString, IsNotEmpty } from 'class-validator';

export class RedirectLinkDto {
  @IsString()
  @IsNotEmpty()
  shortCode: string;
}