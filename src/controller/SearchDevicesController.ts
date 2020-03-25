// Framework
import { JsonController, Get, Param, Res, Authorized, UseBefore, OnUndefined } from "routing-controllers";
import { Response } from "express-serve-static-core";
import { Inject } from "typedi";
let compression = require("compression");

// Local
import { SearchDeviceService } from "../application/SearchDeviceService";
import { SearchDevicesModel } from "../model/SearchDevicesModel";

@JsonController("/search")
@UseBefore(compression())
export class SearchDevicesController{
    
    @Inject()
    private _service: SearchDeviceService;

    /**
     * @api {post} /api/search/devices/:latitude/:longitude/:categoryGuid Get Nearby devices.
     * @apiName Get
     * @apiGroup Search
     * @apiVersion 1.0.0
     *
     * @apiParam {String} latitude Latitude from GPS.
     * @apiParam {String} longitude Longitude from GPS.
     * @apiParam {String} categoryGuid Category GUID.
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     *  
     *   [{
     *       "id": "14",
     *       "point": {
     *       "lat": 33.5123,
     *       "lon": -112.2693
     *       }
     *   }]
     * 
     */      
    
    @Get("/guest/:latitude/:longitude/:categoryGuid")
    @OnUndefined(404)
    async get_guest(@Param("latitude") latitude: string, 
        @Param("longitude") longitude: string, 
        @Param("categoryGuid") categoryGuid: string,        
        @Res() response: Response){
        const searchModel: SearchDevicesModel = {
            latitude: latitude,
            longitude: longitude,
            categoryGuid: categoryGuid
        };

        const points = await this._service.searchNearDevices(searchModel, null);

        return response.send(points);
    }

    @Authorized()
    @Get("/devices/:latitude/:longitude/:categoryGuid/:hardwareId")
    @OnUndefined(404)
    async get(@Param("latitude") latitude: string, 
        @Param("longitude") longitude: string, 
        @Param("categoryGuid") categoryGuid: string,
        @Param("hardwareId") hardwareId: string, 
        @Res() response: Response){
        const searchModel: SearchDevicesModel = {
            latitude: latitude,
            longitude: longitude,
            categoryGuid: categoryGuid
        };

        const points = await this._service.searchNearDevices(searchModel, hardwareId);

        return response.send(points);
    }
}