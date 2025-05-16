/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryEntity } from '../library/library.entity/library.entity';
import { Repository } from 'typeorm';
import { BookEntity } from '../book/book.entity/book.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class LibraryBookService {
    constructor(
        @InjectRepository(LibraryEntity)
        private readonly libraryRepository: Repository<LibraryEntity>,
        
        @InjectRepository(BookEntity)
        private readonly bookRepository: Repository<BookEntity>,
    ) {}

    async addBookToLibrary(libraryId: string, bookId: string): Promise<void> {
        const library = await this.validateIfLibraryExists(libraryId);
        const book = await this.validateIfBookExists(bookId);
        library.books = [...library.books, book];
        await this.libraryRepository.save(library);
    }

    async findBooksToLibrary(libraryId: string): Promise<BookEntity[]> {
        const library = await this.validateIfLibraryExists(libraryId);
        return library.books;
    }

    async findBookFromLibrary(libraryId: string, bookId: string): Promise<BookEntity> {
        const library = await this.validateIfLibraryExists(libraryId);
        const book = await this.validateIfBookExists(bookId);
        const bookInLibrary = this.validateIfBookIsInLibrary(library, book);
        return bookInLibrary;
    }

    async updateBooksFromLibrary(libraryId: string, books: BookEntity[]): Promise<LibraryEntity> {
        const library = await this.validateIfLibraryExists(libraryId);
        for (let i = 0; i < books.length; i++) {
            const book: BookEntity = await this.bookRepository.findOne({ where: { id: books[i].id } });
            await this.validateIfBookExists(book.id);
        }
        library.books = books;
        return await this.libraryRepository.save(library);
    }

    async deleteBookFromLibrary(libraryId: string, bookId: string): Promise<void> {
        const library = await this.validateIfLibraryExists(libraryId);
        const book = await this.validateIfBookExists(bookId);
        this.validateIfBookIsInLibrary(library, book);

        library.books = library.books.filter((b) => b.id !== book.id);
        await this.libraryRepository.save(library);
    }

    private validateIfBookIsInLibrary(library: LibraryEntity, book: BookEntity) {
        const bookInLibrary = library.books.find((b) => b.id === book.id);
        if (!bookInLibrary) {
            throw new BusinessLogicException("The book with the given id is not in the library", BusinessError.PRECONDITION_FAILED);
        }
        return bookInLibrary;
    }

    private async validateIfBookExists(bookId: string) {
        const book = await this.bookRepository.findOne({ where: { id: bookId } });
        if (!book) {
            throw new BusinessLogicException("The book with the given id was not found", BusinessError.NOT_FOUND);
        }
        return book;
    }

    private async validateIfLibraryExists(libraryId: string) {
        const library = await this.libraryRepository.findOne({ where: { id: libraryId }, relations: ['books'] });
        if (!library) {
            throw new BusinessLogicException("The library with the given id was not found", BusinessError.NOT_FOUND);
        }
        return library;
    }
}