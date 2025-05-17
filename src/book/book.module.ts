/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './book.entity/book.entity';
import { BookController } from './book.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity])],
  providers: [BookService],
  controllers: [BookController]
})
export class BookModule {}
