/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { LibraryService } from './library.service';
import { LibraryEntity } from './library.entity/library.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('LibraryService', () => {
  let service: LibraryService;
  let repository: Repository<LibraryEntity>;
  let libraryList: LibraryEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [LibraryService],
    }).compile();

    service = module.get<LibraryService>(LibraryService);
    repository = module.get<Repository<LibraryEntity>>(getRepositoryToken(LibraryEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    libraryList = [];
    for (let i = 0; i < 5; i++) {
      const library: LibraryEntity = await repository.save({
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        openingHour: "08:00:00",
        closingHour: "20:00:00",
      });
      libraryList.push(library);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all libraries', async () => {
    const libraries: LibraryEntity[] = await service.findAll();
    expect(libraries).not.toBeNull();
    expect(libraries).toHaveLength(libraryList.length);
  });

  it('findOne should return a library by id', async () => {
    const storedLibrary: LibraryEntity = libraryList[0];
    const library: LibraryEntity = await service.findOne(storedLibrary.id);
    expect(library).not.toBeNull();
    expect(library.name).toEqual(storedLibrary.name);
    expect(library.address).toEqual(storedLibrary.address);
    expect(library.city).toEqual(storedLibrary.city);
  });

  it('findOne should throw an exception for an invalid library', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty('message', 'The library with the given id was not found');
  });

  it('create should return a new library', async () => {
    const library: LibraryEntity = {
      id: '',
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      openingHour: "08:00:00",
      closingHour: "20:00:00",
      books: [],
    };

    const newLibrary: LibraryEntity = await service.create(library);
    expect(newLibrary).not.toBeNull();

    const storedLibrary: LibraryEntity = await repository.findOne({ where: { id: newLibrary.id } });
    expect(storedLibrary).not.toBeNull();
    expect(storedLibrary.name).toEqual(newLibrary.name);
    expect(storedLibrary.address).toEqual(newLibrary.address);
    expect(storedLibrary.city).toEqual(newLibrary.city);
  });	

  it('update should modify a library', async () => {
    const library: LibraryEntity = libraryList[0];
    library.name = 'New name';
    library.address = 'New address';
    library.city = 'New city';

    const updatedLibrary: LibraryEntity = await service.update(library.id, library);
    expect(updatedLibrary).not.toBeNull();

    const storedLibrary: LibraryEntity = await repository.findOne({ where: { id: library.id } });
    expect(storedLibrary).not.toBeNull();
    expect(storedLibrary.name).toEqual(library.name);
    expect(storedLibrary.address).toEqual(library.address);
    expect(storedLibrary.city).toEqual(library.city);
  });

  it('delete should remove a library', async () => {
    const library: LibraryEntity = libraryList[0];
    await service.delete(library.id);

    const deletedLibrary: LibraryEntity = await repository.findOne({ where: { id: library.id } });
    expect(deletedLibrary).toBeNull();
  });

  it('delete should throw an exception for an invalid library', async () => {
    const library: LibraryEntity = libraryList[0];
    await service.delete(library.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty('message', 'The library with the given id was not found');
  });

  it('create should throw an exception for a library with invalid opening and closing hours', async () => {
    const library: LibraryEntity = {
      id: '',
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      openingHour: "20:00:00",
      closingHour: "08:00:00",
      books: [],
    };

    await expect(() => service.create(library)).rejects.toHaveProperty('message', 'The library\'s opening hour must be before the closing hour');
  });
});
