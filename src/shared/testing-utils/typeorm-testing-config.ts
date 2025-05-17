/* eslint-disable prettier/prettier */

import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from '../../book/book.entity/book.entity';
import { LibraryEntity } from '../../library/library.entity/library.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [BookEntity, LibraryEntity],
    synchronize: true,
    retryAttempts: 5,
    retryDelay: 3000, 
 }),
 TypeOrmModule.forFeature([BookEntity, LibraryEntity]),
];