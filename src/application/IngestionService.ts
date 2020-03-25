// Framework
import { Service, Inject } from "typedi";

// Local
import { IngestionModel } from "../model/IngestionModel";
// import { ServiceBus } from "../insfrastructure/ServiceBus";
// import { IngestionCommand } from "../command/IngestionCommand";
import { GeoDatabase } from "../insfrastructure/GeoDatabase";

@Service()
export class IngestionService{

    // @Inject()
    // private _bus: ServiceBus;

    @Inject()
    private _geoDb: GeoDatabase;
    
    // create(model: IngestionModel): Promise<void>{           
    //     const command = new IngestionCommand(model.latitude, model.longitude, model.deviceId);
    //     return this._bus.sendCommand(command);        
    // }

    create_sync(model: IngestionModel): Promise<void>{
        return new Promise((resolve, reject) => {            
            this._geoDb.setCoordinates(model);

            resolve();
        });
    }
}