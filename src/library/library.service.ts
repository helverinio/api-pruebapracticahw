/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryEntity } from './library.entity/library.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class LibraryService {
    constructor(
        @InjectRepository(LibraryEntity)
        private readonly libraryRepository: Repository<LibraryEntity>,
    ) {
        
    }

    async findAll(): Promise<LibraryEntity[]> {
        return this.libraryRepository.find({relations: ["books"]});
    }

    async findOne(id: string): Promise<LibraryEntity> {
        const library = await this.validateIfLibraryExists(id);
        return library;
    }

    async create (library: LibraryEntity): Promise<LibraryEntity> {
        this.validateOpeningAndClosingHours(library);
        return this.libraryRepository.save(library);
    }

    async update(id: string, library: LibraryEntity): Promise<LibraryEntity> {
        const persistedLibrary = await this.validateIfLibraryExists(id);
        this.validateOpeningAndClosingHours(library);
        return this.libraryRepository.save({ ...persistedLibrary, ...library });
    }

    async delete(id: string) {
        const library = await this.validateIfLibraryExists(id);
        await this.libraryRepository.remove(library);
    }

    private validateOpeningAndClosingHours(library: LibraryEntity) {
        if (library.openingHour >= library.closingHour) {
            throw new BusinessLogicException("The library's opening hour must be before the closing hour", BusinessError.PRECONDITION_FAILED);
        }
    }

    private async validateIfLibraryExists(id: string) {
        const library = await this.libraryRepository.findOne({ where: { id }, relations: ["books"] });
        if (!library) {
            throw new BusinessLogicException("The library with the given id was not found", BusinessError.NOT_FOUND);
        }
        return library;
    }
}