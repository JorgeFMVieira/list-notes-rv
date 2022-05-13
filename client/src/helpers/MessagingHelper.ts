export class MessagingHelper<T> {
    success: boolean;
    message : string;
    obj : T;

    constructor(success: boolean, message: string, obj: T) {
        this.success = success;
        this.message = message;
        this.obj = obj;
    }
}