/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LibraryBookService } from './library-book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryEntity } from '../library/library.entity/library.entity';
import { BookEntity } from '../book/book.entity/book.entity';
import { LibraryBookController } from './library-book.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LibraryEntity, BookEntity])],
  providers: [LibraryBookService],
  controllers: [LibraryBookController]
})
export class LibraryBookModule {}
