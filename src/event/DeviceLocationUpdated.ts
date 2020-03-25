// Local
import { IEvent } from "./IEvent";
import { EVENT_QUEUES } from "../insfrastructure/Constants";

export class DeviceLocationUpdated implements IEvent{
    public name: string = EVENT_QUEUES.DEVICE_LOCATION_UPDATED;
    public latitude: string;
    public longitude: string;
    public deviceId: string;

    constructor(latitude: string, longitude: string, deviceId: string){
        this.latitude = latitude;
        this.longitude = longitude;
        this.deviceId = deviceId;
    }
}