import { BaseEntity } from './interfaces/base-entity';

export class Patient implements BaseEntity {
    constructor(
        public id?: string,
        public name?: string,
        public birthdate?: Date,
        public phone?: string,
        public email?: string,
        public procedures?: [],
        public appointments?: Appointment[],
    ) {
    }
}

export class Appointment implements BaseEntity {
    hide: boolean = false;
    constructor(
        public id?: string,
        public name?: string,
        public birthdate?: Date,
        public phone?: string,
        public email?: string,
        public procedures?: [],
        public procedureStartDateTime?: Date,
        public procedureEndDateTime?: Date,
        public procedureMonth?: number,
        public procedureYear?: number,
        public diagnostic?: string,
        public notes?: string,
    ) {
        this.hide = false;
    }
}

export class Problem implements BaseEntity {
    hide: boolean = false;
    constructor(
        public id?: string,
        public subject?: string,
        public description?: string,
        public createDate?: Date,
        public lastUpdateDate?: Date,
        public phone?: string,
        public author?: string,
        public status?: Status,
        public email?: string,
        public category?: string,
        public notes?: [],
        public city?: string,
        public imageThumb?: string,
        public image?: string,
        public auditLog?: [Audit],
    ) {
        this.hide = false;
    }
}

export interface Audit {
    status?: Status;
    date?: Date;
    author?: string;
    notes?: string;
}

export enum Status {
    NEW = 'NEW',
    REGISTERED = 'REGISTERED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETE = 'COMPLETE',
    CANCELED = 'CANCELED'
}