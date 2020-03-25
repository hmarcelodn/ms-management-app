export class UserNotFoundError extends Error{
    constructor(m?: string){
        super(m);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = UserNotFoundError.name;
    }
}