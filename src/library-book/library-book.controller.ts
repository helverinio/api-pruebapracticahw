/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { LibraryBookService } from './library-book.service';
import { BookDto } from '../book/book.dto/book.dto';
import { plainToInstance } from 'class-transformer';
import { BookEntity } from 'src/book/book.entity/book.entity';

@Controller('libraries')
@UseInterceptors(BusinessErrorsInterceptor)
export class LibraryBookController {
    constructor(private readonly libraryBookService: LibraryBookService) {}

    @Post(':libraryId/books/:bookId')
    async addBookToLibrary(@Param('libraryId') libraryId: string, @Param('bookId') bookId: string) {
        return await this.libraryBookService.addBookToLibrary(libraryId, bookId);
    }

    @Get(':libraryid/books/:bookId')
    async findBookInLibrary(@Param('libraryId') libraryId: string, @Param('bookId') bookId: string) {
        return await this.libraryBookService.findBookFromLibrary(libraryId, bookId);
    }
    @Get(':libraryId/books')
    async findBooksInLibrary(@Param('libraryId') libraryId: string) {
        return await this.libraryBookService.findBooksToLibrary(libraryId);
    }
    @Put(':libraryId/books')
    async updateBooksInLibrary(@Body() booksDto: BookDto[], @Param('libraryId') libraryId: string) {
        const books = plainToInstance(BookEntity, booksDto);
        return await this.libraryBookService.updateBooksFromLibrary(libraryId, books);
    }
    @Delete(':libraryId/books/:bookId')
    @HttpCode(204)
    async deleteBookFromLibrary(@Param('libraryId') libraryId: string, @Param('bookId') bookId: string) {
        return await this.libraryBookService.deleteBookFromLibrary(libraryId, bookId);
    }
}
