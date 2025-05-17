/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString} from 'class-validator';

export class BookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  publishedDate: Date;

  @IsNotEmpty()
  ISBN: string;
}
