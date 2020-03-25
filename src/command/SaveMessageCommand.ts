import { ICommand } from "./ICommand";
import { COMMAND_QUEUES } from "../insfrastructure/Constants";

export class SaveMessageCommand implements ICommand{
    public name: string = COMMAND_QUEUES.QUEUE_COMMAND_SAVE_MESSAGE;
    public releaseDate: Date;    
    public message: string;

    constructor(message: string){
        this.message = message;
    }
}