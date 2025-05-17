/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryEntity } from './library.entity/library.entity';
import { LibraryController } from './library.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LibraryEntity])],
  providers: [LibraryService],
  controllers: [LibraryController]
})
export class LibraryModule {}
