// Framework
import "reflect-metadata";
import {JsonController, Get, Post, Body, Param, OnUndefined, Authorized, UseBefore } from "routing-controllers";
import {Inject} from "typedi";
let compression = require("compression");

// Local
import { ServiceCategoryService } from "../application/ServiceCategoryService";
import { ServiceCategoryModel } from "../model/ServiceCategoryModel";

@JsonController("/category")
@UseBefore(compression())
export class ServiceCategoryController{
    
    @Inject()
    _service: ServiceCategoryService;

    @Post("/")
    post(@Body() model: ServiceCategoryModel){
        this._service.create(model);
    }

    /**
     * @api {get} /api/category/:id Get One Category.
     * @apiName Get
     * @apiGroup Category
     * @apiVersion 1.0.0
     *
     * @apiParam {String} id Category UUID.
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     *  
     *   {
     *       "id": "7e28400e-ab16-40bb-868b-37c5fbdd7e72",
     *       "name": "Peluquería",
     *       "parent_id": null
     *   }
     * 
     */        
    @Get("/:id")
    @OnUndefined(404)
    get(@Param("id") id: string){
        return this._service.get(id);
    }

    /**
     * @api {get} /api/category/ Get All Categories.
     * @apiName GetAll
     * @apiGroup Category
     * @apiVersion 1.0.0
     *
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     *  
     *   [
     *       {
     *           "id": "7e28400e-ab16-40bb-868b-37c5fbdd7e72",
     *           "name": "Peluquería",
     *           "parent_id": null
     *       },
     *       {
     *           "id": "0077a5a8-aa75-4ac7-898b-9dd68d75b6b0",
     *           "name": "Tareas del Hogar",
     *           "parent_id": null
     *       }
     *   ]
     * 
     */      
    @Get("/")
    getAll(){
        return this._service.getAll();
    }

}