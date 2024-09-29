export class PaginatedResponse<T> {
    total: number;
    page: number;
    limit: number;
    data: T[];

    constructor(data: T[] = [], total: number = 0, page: number = 1, limit: number = 10) {
        this.data = data;
        this.total = total;
        this.page = page;
        this.limit = limit;
    }
}
