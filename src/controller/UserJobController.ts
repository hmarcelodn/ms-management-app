// Framework
import "reflect-metadata";
import {JsonController, Param, Body, Get, Post, Put, Delete, Controller, Res, Req, Authorized, CurrentUser, OnUndefined, UseBefore} from "routing-controllers";
import {Inject} from "typedi";
let compression = require("compression");

// Local
import { UserJobModel } from "../model/UserJobModel";
import { UserJobService } from "../application/UserJobService";
import { User } from "../entity/User";
import { CategoryNotFoundError } from "../entity/exception/CategoryNotFoundError";
import { UserNotFoundError } from "../entity/exception/UserNotFoundError";
import { UserJobAlreadyRequestedError } from "../entity/exception/UserJobAlreadyRequestedError";
import { Response } from "express-serve-static-core";

@Authorized()
@JsonController("/job")
@UseBefore(compression())
export class UserJobController{

    @Inject()
    _service: UserJobService;

     /**
     * @api {post} /api/job Create a new Job between two users.
     * @apiName Post
     * @apiGroup User
     * @apiVersion 1.0.0
     *
     * @apiParam {String} userGuid User UUID.
     * @apiParam {String} categoryGuid Category UUID.
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * 
     */      
    @Post("/")
    async post(@CurrentUser({ required: true }) user: User, @Body() model: UserJobModel, @Res() response: Response){
        try{
            return await this._service.request(user, model);
        }
        catch(e){
            if(e instanceof CategoryNotFoundError || 
               e instanceof UserNotFoundError || 
               e instanceof UserJobAlreadyRequestedError){                

                return response.send(400, {
                    error: e.message
                });
            }

            throw e;
        }
    }
     
    @Put("/")
    async put(@Body() model: any){
        switch(model.type){
            case "complete":
                await this._service.complete(model);
                break;

            case "reject":
                await this._service.reject(model);
                break;                        
        }
        
    }
}