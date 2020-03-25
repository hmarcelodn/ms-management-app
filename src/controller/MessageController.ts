// Framework
import { JsonController, Get, Param, Res, Authorized, UseBefore, OnUndefined } from "routing-controllers";
import { MessageService } from "../application/MessageService";
import { Response } from "express-serve-static-core";
let compression = require("compression");

// Local
import { Inject } from "typedi";

@Authorized()
@JsonController("/message")
@UseBefore(compression())
export class MessageController{

    @Inject()
    _service: MessageService;

    /**
     * @api {post} /api/message/:id Get Chat Messages
     * @apiName Message
     * @apiGroup Message
     * @apiVersion 1.0.0
     *
     * @apiParam {String} id Message UUID.
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *  message: "A chat message"
     * }
     */    
    @Get('/:id')
    @OnUndefined(404)
    async get(@Param("id") id: string, @Res() response: Response){
        const messages = await this._service.get(id);
        return response.send(messages);
    }

}