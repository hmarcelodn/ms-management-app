export class ExistingUserError extends Error{
    constructor(m?: string){
        super(m);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = ExistingUserError.name;
    }
}