export class UserJobAlreadyRequestedError extends Error{
    constructor(m: string){
        super(m);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = UserJobAlreadyRequestedError.name;
    }
}