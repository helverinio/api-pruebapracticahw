/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './book.entity/book.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class BookService {

    constructor(
        @InjectRepository(BookEntity)
        private readonly bookRepository: Repository<BookEntity>,
    ) {
        
    }

    async findAll(): Promise<BookEntity[]> {
        return this.bookRepository.find({relations: ["libraries"]});
    }

    async findOne(id: string): Promise<BookEntity> {
        const book: BookEntity = await this.bookRepository.findOne({ where: { id }, relations: ["libraries"] });
        if (!book) {
            throw new BusinessLogicException("The book with id was not found", BusinessError.NOT_FOUND);
        }
        return book;
    }

    async create(book: BookEntity): Promise<BookEntity> {
        this.validatePublishedDate(book);
        return this.bookRepository.save(book);
    }

    async update(id: string, book: BookEntity): Promise<BookEntity> {
        const persistedBook: BookEntity = await this.bookRepository.findOne({ where: { id } });
        if (!persistedBook) {
            throw new BusinessLogicException("The book with id was not found", BusinessError.NOT_FOUND);
        }
        this.validatePublishedDate(book);
        return this.bookRepository.save({ ...persistedBook, ...book });
    }

    async delete(id: string) {
        const book: BookEntity = await this.bookRepository.findOne({ where: { id } });
        if (!book) {
            throw new BusinessLogicException("The book with id was not found", BusinessError.NOT_FOUND);
        }
        await this.bookRepository.remove(book);
    }

    validatePublishedDate(book: BookEntity) {
        if (book.publishedDate > new Date()) {
            throw new BusinessLogicException("The book's published date must be in the past or today", BusinessError.PRECONDITION_FAILED);
        }
    }
}
