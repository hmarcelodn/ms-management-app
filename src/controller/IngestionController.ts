// Framework
import "reflect-metadata";
import {JsonController, Get, Post, Body, Res, Authorized, UseBefore } from "routing-controllers";
import {Inject} from "typedi";
import { Response } from "express-serve-static-core";
let compression = require("compression");

// Local
import { IngestionService } from "../application/IngestionService";
import { IngestionModel } from "../model/IngestionModel";

@Authorized()
@JsonController("/device")
@UseBefore(compression())
export class IngestionController{

    @Inject()
    _service: IngestionService;

    /**
     * @api {post} /api/ingestion/ Post GPS Coords
     * @apiName Ingestion
     * @apiGroup Ingestion
     * @apiVersion 1.0.0
     *
     * @apiParam {String} latitude Device latitude from GPS Sensor.
     * @apiParam {String} longitude Device longitude from GPS Sensor.
     * @apiParam {String} deviceId Device deviceId from Device.
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     */
    @Post("/")
    async post(@Body() model: IngestionModel, @Res() response: Response){
        //this._service.create(model);
        await this._service.create_sync(model);
        return response.sendStatus(200); 
    }
}