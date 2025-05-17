/* eslint-disable prettier/prettier */

import { LibraryEntity } from "../../library/library.entity/library.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BookEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    publishedDate: Date;

    @Column()
    ISBN: string;

    @ManyToMany(() => LibraryEntity, (library) => library.books)
    @JoinTable() 
    libraries: LibraryEntity[];
}
