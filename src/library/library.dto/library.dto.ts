/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString, Matches } from "class-validator";

export class LibraryDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'openingHour must be in HH:mm:ss format' })
    openingHour: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: 'closingHour must be in HH:mm:ss format' })
    closingHour: string;
}
