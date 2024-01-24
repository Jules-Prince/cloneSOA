export class DataDto {
    height: number;

    constructor(partial: Partial<DataDto>) {
        Object.assign(this, partial);
    }
}
