export class Pagination<T>{
    success: boolean = false;
    obj: T[] = [];
    currentPage: number = 0;
    totalPages: number = 0;
}