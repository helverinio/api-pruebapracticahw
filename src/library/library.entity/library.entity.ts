/* eslint-disable prettier/prettier */

import { BookEntity } from "../../book/book.entity/book.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LibraryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    schedule: string;

    @ManyToMany(() => BookEntity, (book) => book.libraries)
    books: BookEntity[];
}
