import { BaseEntity } from './interfaces/base-entity';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';

export class Patient implements BaseEntity {
    constructor(
        public id?: string,
        public name?: string,
        public birthdate?: Date,
        public phone?: string,
        public procedures?: [],
    ) {
    }
}

export class Appointment implements BaseEntity {
    constructor(
        public id?: string,
        public name?: string,
        public birthdate?: Date,
        public phone?: string,
        public procedure?: string,
        public procedures?: [],
        public procedureStartDateTime?: Date,
        public procedureEndDateTime?: Date,
        public procedureMonth?: number,
        public diagnostic?: string,
        public notes?: string,
    ) {
    }
}
