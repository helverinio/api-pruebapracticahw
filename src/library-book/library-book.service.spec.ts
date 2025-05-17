/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { LibraryBookService } from './library-book.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { LibraryEntity } from '../library/library.entity/library.entity';
import { BookEntity } from '../book/book.entity/book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { fa, faker } from '@faker-js/faker';

describe('LibraryBookService', () => {
  let service: LibraryBookService;
  let libraryRepository: Repository<LibraryEntity>;
  let bookRepository: Repository<BookEntity>;
  let bookList: BookEntity[];
  let library: LibraryEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [LibraryBookService],
    }).compile();

    service = module.get<LibraryBookService>(LibraryBookService);
    libraryRepository = module.get<Repository<LibraryEntity>>(getRepositoryToken(LibraryEntity));
    bookRepository = module.get<Repository<BookEntity>>(getRepositoryToken(BookEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await libraryRepository.clear();
    await bookRepository.clear();

    library = await libraryRepository.save({
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      openingHour: '08:00:00',
      closingHour: '20:00:00',
    });

    bookList = [];
    for (let i = 0; i < 5; i++) {
      const book: BookEntity = await bookRepository.save({
        title: `Book ${i}`,
        author: faker.person.fullName(),
        publishedDate: faker.date.past(),
        ISBN: faker.string.uuid(),
        libraries: [library],
      });
      bookList.push(book);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addBookToLibrary should add a book to the library', async () => {	
    const newBook: BookEntity = await bookRepository.save({
      title: 'New Book',
      author: faker.person.fullName(),
      publishedDate: faker.date.past(),
      ISBN: faker.string.uuid(),
      libraries: [library],
    });

    const newLibrary: LibraryEntity = await libraryRepository.save({
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      openingHour: '08:00:00',
      closingHour: '18:00:00',
    });

    await service.addBookToLibrary(newLibrary.id, newBook.id);
    const libraryWithBooks = await libraryRepository.findOne({
      where: { id: newLibrary.id },
      relations: ['books'],
    });

    expect(libraryWithBooks).not.toBeNull();
    expect(libraryWithBooks.books[0].id).toEqual(newBook.id);
    expect(libraryWithBooks.books[0].title).toEqual(newBook.title);
    expect(libraryWithBooks.books[0].author).toEqual(newBook.author);
    expect(libraryWithBooks.books[0].publishedDate).toEqual(newBook.publishedDate);
    expect(libraryWithBooks.books[0].ISBN).toEqual(newBook.ISBN);
  });

  it('AddBookToLibrary should throw an exception for an invalid library', async () => {
    const newBook: BookEntity = await bookRepository.save({
      title: 'New Book',
      author: faker.person.fullName(),
      publishedDate: faker.date.past(),
      ISBN: faker.string.uuid(),
      libraries: [library],
    });

    const invalidLibraryId = 'invalid-library-id';
    await expect(service.addBookToLibrary(invalidLibraryId, newBook.id)).rejects.toHaveProperty(
      'message', 'The library with the given id was not found',
    );
  });

  it('AddBookToLibrary should throw an exception for an invalid book', async () => {
    const newLibrary: LibraryEntity = await libraryRepository.save({
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      openingHour: '08:00:00',
      closingHour: '18:00:00',
    });

    const invalidBookId = 'invalid-book-id';
    await expect(service.addBookToLibrary(newLibrary.id, invalidBookId)).rejects.toHaveProperty(
      'message', 'The book with the given id was not found',
    );
  });

  it('fingBookByLibrary should return a book by library', async () => {
    const book: BookEntity = bookList[0];

    const storedBook: BookEntity = await service.findBookFromLibrary(library.id, book.id);
    expect(storedBook).not.toBeNull();
    expect(storedBook.id).toEqual(book.id);
    expect(storedBook.title).toEqual(book.title);
    expect(storedBook.author).toEqual(book.author);
    expect(storedBook.publishedDate).toEqual(book.publishedDate);
  });

  it('findBookByLibrary should throw an exception for an invalid book', async () => {
    const invalidBookId = 'invalid-book-id';
    await expect(() => service.findBookFromLibrary(library.id, invalidBookId)).rejects.toHaveProperty(
      'message', 'The book with the given id was not found',
    );
  });

  it('findBookByLibrary should throw an exception for an invalid library', async () => {
    const book: BookEntity = bookList[0];
    const invalidLibraryId = 'invalid-library-id';
    await expect(() => service.findBookFromLibrary(invalidLibraryId, book.id)).rejects.toHaveProperty(
      'message', 'The library with the given id was not found',
    );
  });

  it('findBookByMMuseum shuld throw an exception for a book not in the library', async () => {
    const book: BookEntity = bookList[0];
    const newLibrary: LibraryEntity = await libraryRepository.save({
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      openingHour: '08:00:00',
      closingHour: '18:00:00',
    });

    await expect(() => service.findBookFromLibrary(newLibrary.id, book.id)).rejects.toHaveProperty(
      'message', 'The book with the given id is not in the library',
    );
  });
  it('findBooksToLibrary should return books by library', async () => {
    const books: BookEntity[] = await service.findBooksToLibrary(library.id);
    expect(books).not.toBeNull();
    expect(books).toHaveLength(bookList.length);
  });

  it('associateBooksToLibrary should update books for a library', async () => {
    const newBook = await bookRepository.save({
      title: 'New Book',
      author: faker.person.fullName(),
      publishedDate: faker.date.past(),
      ISBN: faker.string.uuid(),
      libraries: [library],
    });

    await service.updateBooksFromLibrary(library.id, [newBook]);
    const libraryWithBooks = await libraryRepository.findOne({
      where: { id: library.id },
      relations: ['books'],
    });

    expect(libraryWithBooks).not.toBeNull();
    expect(libraryWithBooks.books).toHaveLength(1);
    expect(libraryWithBooks.books[0].id).toEqual(newBook.id);
    expect(libraryWithBooks.books[0].title).toEqual(newBook.title);
    expect(libraryWithBooks.books[0].author).toEqual(newBook.author);
    expect(libraryWithBooks.books[0].publishedDate).toEqual(newBook.publishedDate);
    expect(libraryWithBooks.books[0].ISBN).toEqual(newBook.ISBN);
  });

  it('deleteBookFromLibrary should remove a book from the library', async () => {
    const book: BookEntity = bookList[0];
    await service.deleteBookFromLibrary(library.id, book.id);
    const libraryWithBooks = await libraryRepository.findOne({
      where: { id: library.id },
      relations: ['books'],
    });

    expect(libraryWithBooks).not.toBeNull();
    expect(libraryWithBooks.books).toHaveLength(bookList.length - 1);
    expect(libraryWithBooks.books.find((b) => b.id === book.id)).toBeUndefined();
  });

});
