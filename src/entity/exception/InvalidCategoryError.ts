export class InvalidCategoryError extends Error{
    constructor(m?: string){
        super(m);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = InvalidCategoryError.name;
    }
}