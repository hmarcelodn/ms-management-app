import { ICommand } from "./ICommand";
import { COMMAND_QUEUES } from "../insfrastructure/Constants";

export class IngestionCommand implements ICommand {
    public name: string = COMMAND_QUEUES.QUEUE_COMMAND_INGESTION;
    public releaseDate: Date;
    public latitude: string;
    public longitude: string;
    public deviceId: string;

    constructor(latitude:string, longitude: string, deviceId: string){
        this.latitude = latitude;
        this.longitude = longitude;
        this.deviceId = deviceId;
    }
}