// Framework
import "reflect-metadata";
import {JsonController, Param, Body, Get, Post, Put, Delete, Controller, Res, Req, Authorized, CurrentUser, UseBefore} from "routing-controllers";
import {Inject} from "typedi";
let compression = require("compression");

// Local
import { User } from "../entity/User";
import { LoginModel } from "../model/LoginModel";
import { UserService } from "../application/UserService";
import { CreateUserModel } from "../model/CreateUserModel";
import { UserCategoryModel } from "../model/UserCategoryModel";
import { ExternalLoginModel } from "../model/ExternalLoginModel";
import { Response } from "express-serve-static-core";
import { ExistingUserError } from "../entity/exception/ExistingUserError";
import { InvalidCategoryError } from "../entity/exception/InvalidCategoryError";

@JsonController("/user")
@UseBefore(compression())
export class UserController{

    @Inject()
    _service: UserService;

    /**
     * @api {post} /api/user/ Create an internal user.
     * @apiName Post
     * @apiGroup User
     * @apiVersion 1.0.0
     *
     * @apiParam {String} userName Category UUID.
     * @apiParam {String} firstName Category UUID.
     * @apiParam {String} lastName Category UUID.
     * @apiParam {String} emailAddress Category UUID.
     * @apiParam {String} password Category UUID.
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * 
     */      
    @Post("/")
    async post(@Body() model: CreateUserModel, @Res() response: Response){
        try{
            return await this._service.create(model);
        }
        catch(e){
            if(e instanceof ExistingUserError){                
                 return response.send(400, {
                     error: e.message
                 });
             }
 
             throw e;
        }
    }

    /**
     * @api {post} /api/internal/login Login for internal users.
     * @apiName Login
     * @apiGroup User
     * @apiVersion 1.0.0
     *
     * @apiParam {String} email Category UUID.
     * @apiParam {String} password Category UUID.
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     *   {
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhtZGVsbmVncm9AZ21haWwuY29tIiwidXVpZCI6IjIxMmZiMGQzLTE1ZjEtNGZlNy1iNjcyLWZmZWNmYTA1ZDAyMyIsImlhdCI6MTU0MzUxMDEyMywiZXhwIjoxNTQzNzk4MTIzfQ.Z06T46k37_HoHE2hbc7px2ykcz3wNOmh-ZlY06U2a4Q",
     *      "success": true,
     *      "message": "Success"
     *   }
     */      
    @Post("/internal/login")
    async login(@Body() model: LoginModel){
        return await this._service.login(model);
    }

    /**
     * @api {post} /api/external/google Login for Google users.
     * @apiName ExternalGoogle
     * @apiGroup User
     * @apiVersion 1.0.0
     *
     * @apiParam {String} email Category UUID.
     * @apiParam {String} password Category UUID.
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     *   {
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhtZGVsbmVncm9AZ21haWwuY29tIiwidXVpZCI6IjIxMmZiMGQzLTE1ZjEtNGZlNy1iNjcyLWZmZWNmYTA1ZDAyMyIsImlhdCI6MTU0MzUxMDEyMywiZXhwIjoxNTQzNzk4MTIzfQ.Z06T46k37_HoHE2hbc7px2ykcz3wNOmh-ZlY06U2a4Q",
     *      "success": true,
     *      "message": "Success"
     *   }
     */ 
    @Post("/external/google")
    externalGoogle(model: ExternalLoginModel){
        this._service.externalLogin(model, "google");
    }

    /**
     * @api {post} /api/external/instagram Login for Instagram users.
     * @apiName ExternalInstagram
     * @apiGroup User
     * @apiVersion 1.0.0
     *
     * @apiParam {String} email Category UUID.
     * @apiParam {String} password Category UUID.
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     *  {
     *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhtZGVsbmVncm9AZ21haWwuY29tIiwidXVpZCI6IjIxMmZiMGQzLTE1ZjEtNGZlNy1iNjcyLWZmZWNmYTA1ZDAyMyIsImlhdCI6MTU0MzUxMDEyMywiZXhwIjoxNTQzNzk4MTIzfQ.Z06T46k37_HoHE2hbc7px2ykcz3wNOmh-ZlY06U2a4Q",
     *   "success": true,
     *   "message": "Success"
     *  }
     */ 
    @Post("/external/instagram")
    externalInstagram(model: ExternalLoginModel){
        this._service.externalLogin(model, "instagram");
    }

    /**
     * @api {post} /api/external/facebook Login for Facebook users.
     * @apiName ExternalFacebook
     * @apiGroup User
     * @apiVersion 1.0.0
     *
     * @apiParam {String} email Category UUID.
     * @apiParam {String} password Category UUID.
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     *   {
     *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhtZGVsbmVncm9AZ21haWwuY29tIiwidXVpZCI6IjIxMmZiMGQzLTE1ZjEtNGZlNy1iNjcyLWZmZWNmYTA1ZDAyMyIsImlhdCI6MTU0MzUxMDEyMywiZXhwIjoxNTQzNzk4MTIzfQ.Z06T46k37_HoHE2hbc7px2ykcz3wNOmh-ZlY06U2a4Q",
     *   "success": true,
     *   "message": "Success"
     *   }
     */     
    @Post("/external/facebook")
    externalFacebook(model: ExternalLoginModel){
        this._service.externalLogin(model, "facebook");
    }

     /**
     * @api {put} /api/user/category Login for Facebook users.
     * @apiName AddCategory
     * @apiGroup User
     * @apiVersion 1.0.0
     *
     * @apiParam {String} categoryGuid Category UUID.
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     *   {
     *       "categoryGuid": "eb1ae6a4-8f76-411e-a42a-b941793fbfbb"
     *   }
     */     
    @Authorized()
    @Put("/category")    
    async addCategory(@CurrentUser({ required: true }) user: User, @Res() response: Response, @Body() model: UserCategoryModel){
        try{
            await this._service.addCategory(user, model);
            return response.sendStatus(200);
        }
        catch(e){
            if(e instanceof InvalidCategoryError){                
                 return response.send(400, {
                     error: e.message
                 });
             }
 
            throw e;            
        }
    }
}