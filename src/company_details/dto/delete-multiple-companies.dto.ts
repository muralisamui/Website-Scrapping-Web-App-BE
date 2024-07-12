import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class DeleteMultipleCompaniesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}
