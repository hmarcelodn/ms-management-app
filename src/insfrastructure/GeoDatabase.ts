// Framework
import * as Tile38 from "tile38";

// Local
import { IngestionModel } from "../model/IngestionModel";
import { SearchDevicesQueryModel } from "../model/SearchDevicesQueryModel";

export class GeoDatabase{
    private _tile38;

    constructor(){
        // const tileHost = process.env.TILE38_HOST || "mashcoop.com";
        const tileHost = process.env.TILE38_HOST || "localhost";
        const tilePort = process.env.TILE38_PORT || 9851;
        this._tile38 = new Tile38({ host: tileHost, port: tilePort, debug: true });
    }

    setCoordinates(model: IngestionModel): void{
        this._tile38.set('devices', model.deviceId, [ model.latitude, model.longitude ]);
    }

    searchNearbyDevices(model: SearchDevicesQueryModel): Promise<any>{
        let query = this._tile38.nearbyQuery('devices')
                                .distance()
                                .output('points')
                                .point(model.latitude, model.longitude, model.radius);
        return query.execute();
    }

}