// Framework
import { Service, Inject } from "typedi";
import * as _ from "lodash";

// Local
import { GeoDatabase } from "../insfrastructure/GeoDatabase";
import { SearchDevicesModel } from "../model/SearchDevicesModel";
import { SearchDevicesQueryModel } from "../model/SearchDevicesQueryModel";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repository/UserRepository";

@Service()
export class SearchDeviceService{

    @Inject()
    private _geoDb: GeoDatabase;

    // TODO: 0(N^2) This function is quadratic and can be improved in performance
    async searchNearDevices(model: SearchDevicesModel, hardwareId?:string): Promise<any>{

        const queryModel: SearchDevicesQueryModel = {
            latitude: model.latitude,
            longitude: model.longitude, 
            radius: 100000
        };

        const userRepo = getCustomRepository(UserRepository);   
        const nearDevices = await this._geoDb.searchNearbyDevices(queryModel);
        let nearbyGeolocation = nearDevices.points; 
        
        if(hardwareId){
            nearbyGeolocation = _.filter(nearDevices.points, (o) => { 
                return (o.id !== hardwareId);
            });
        }

        let deviceList = new Array<string>();
        let availablePoints = [];

        _.forEach(nearbyGeolocation, (v, i) => {
            deviceList.push(v.id);
        });

        const usersAvailable = await userRepo.getByDeviceIds(deviceList, model.categoryGuid);     
        
        // O(N^2). It can be improved via Hashtables.
        if(usersAvailable && usersAvailable.length > 0){
            _.forEach(usersAvailable, (v, i) => {
                _.forEach(nearbyGeolocation, (v2, i2) => {
                    if(v2.id === v.deviceId){
                        availablePoints.push(v2);
                    }
                });
            });
        }

        return availablePoints;
    }

}