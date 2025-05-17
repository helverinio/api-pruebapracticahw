/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { BookService } from './book.service';
import { BookDto } from './book.dto/book.dto';
import { BookEntity } from './book.entity/book.entity';
import { plainToInstance } from 'class-transformer';

@Controller('books')
@UseInterceptors(BusinessErrorsInterceptor)
export class BookController {

    constructor(private readonly bookService: BookService) {}

    @Get()
    async findAll() {
        return await this.bookService.findAll();
    }

    @Get(':bookId')
    async findOne(@Param('bookId') bookId: string) {
        return await this.bookService.findOne(bookId);
    }

    @Post()
    async create(@Body() bookDto: BookDto) {
        const book: BookEntity = plainToInstance(BookEntity, bookDto);
        return await this.bookService.create(book);
    }

    @Put(':bookId')
    async update(@Param('bookId') bookId: string, @Body() bookDto: BookDto) {
        const book: BookEntity = plainToInstance(BookEntity, bookDto);
        return await this.bookService.update(bookId, book);
    }
    
    @Delete(':bookId')
    @HttpCode(204)
    async delete(@Param('bookId') bookId: string) {
        return await this.bookService.delete(bookId);
    }

}
