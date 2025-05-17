/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { BookEntity } from './book.entity/book.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('BookService', () => {
  let service: BookService;
  let repository: Repository<BookEntity>;
  let bookList: BookEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BookService],
    }).compile();

    service = module.get<BookService>(BookService);
    repository = module.get<Repository<BookEntity>>(getRepositoryToken(BookEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    bookList = [];
    for (let i = 0; i < 5; i++) {
      const book: BookEntity = await repository.save({
        title: faker.lorem.sentence(),
        author: faker.person.fullName(),
        publishedDate: faker.date.past(),
        ISBN: faker.string.uuid(),
        libraries: [],
      });
      bookList.push(book);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all books', async () => {
    const books: BookEntity[] = await service.findAll();
    expect(books).not.toBeNull();
    expect(books).toHaveLength(bookList.length);
  });

  it('findOne should return a book by id', async () => {
    const storedBook: BookEntity = bookList[0];
    const book: BookEntity = await service.findOne(storedBook.id);
    expect(book).not.toBeNull();
    expect(book.title).toEqual(storedBook.title);
    expect(book.author).toEqual(storedBook.author);
    expect(book.publishedDate).toEqual(storedBook.publishedDate);
  });

  it('findOne should throw an exception for an invalid book', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The book with id was not found");
  });

  it('create should return a new book', async () => {
    const book: BookEntity = {
      id: "",
      title: faker.lorem.sentence(),
      author: faker.person.fullName(),
      publishedDate: faker.date.past(),
      ISBN: faker.string.uuid(),
      libraries: [],
    };

    const newBook: BookEntity = await service.create(book);
    expect(newBook).not.toBeNull();

    const storedBook: BookEntity = await repository.findOne({ where: { id: newBook.id } });
    expect(storedBook).not.toBeNull();
    expect(storedBook.title).toEqual(newBook.title);
    expect(storedBook.author).toEqual(newBook.author);
    expect(storedBook.publishedDate).toEqual(newBook.publishedDate);
    expect(storedBook.ISBN).toEqual(newBook.ISBN);
    });

  it('update should modify a book', async () => {
    const book: BookEntity = bookList[0];
    book.title = "New title";
    book.author = "New author";
    book.publishedDate = new Date();
    book.ISBN = "New ISBN";

    const updatedBook: BookEntity = await service.update(book.id, book);
    expect(updatedBook).not.toBeNull();

    const storedBook: BookEntity = await repository.findOne({ where: { id: book.id } });
    expect(storedBook).not.toBeNull();
    expect(storedBook.title).toEqual(book.title);
    expect(storedBook.author).toEqual(book.author);
    expect(storedBook.publishedDate).toEqual(book.publishedDate);
  });

  it('update should throw an exception for an invalid book', async () => {
    let book: BookEntity = bookList[0];
    book = {
      ...book,
      title: "New title",
      author: "New author",
      publishedDate: new Date(),
      ISBN: "New ISBN",
    };
    await expect(() => service.update("0", book)).rejects.toHaveProperty("message", "The book with id was not found");
  });

  it('delete should remove a book', async () => {
    const book: BookEntity = bookList[0];
    await service.delete(book.id);

    const deletedBook: BookEntity = await repository.findOne({ where: { id: book.id } });
    expect(deletedBook).toBeNull();
  });

  it('delete should throw an exception for an invalid book', async () => {
    const book: BookEntity = bookList[0];
    await service.delete(book.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The book with id was not found");
  });

  it('create should throw an exception for a book with future published date', async () => {
    const book: BookEntity = {
      id: "",
      title: faker.lorem.sentence(),
      author: faker.person.fullName(),
      publishedDate: faker.date.future(),
      ISBN: faker.string.uuid(),
      libraries: [],
    };

    await expect(() => service.create(book)).rejects.toHaveProperty("message", "The book's published date must be in the past or today");
  });

});
