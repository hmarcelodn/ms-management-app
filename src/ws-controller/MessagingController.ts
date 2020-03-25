import { SocketController, OnMessage, ConnectedSocket, MessageBody, OnConnect, OnDisconnect, SocketId } from "socket-controllers";
import { Inject } from "typedi";
import { MessageService } from "../application/MessageService";

@SocketController()
export class MessagingController{

    @Inject()
    private _messageService: MessageService;
    private _clients = {};

    @OnConnect()
    connection(@ConnectedSocket() socket: any) {
        console.log("client connected: " + socket.id);
    }
 
    @OnDisconnect()
    disconnect(@ConnectedSocket() socket: any) {
        delete this._clients[socket.id];    
    }

    @OnMessage("registerUserName")
    registerUserName(@ConnectedSocket() socket: any, @MessageBody() message: any){
        this._clients[message.userName] = socket.id;
    }

    @OnMessage("newMessageSent")    
    newMessage(@ConnectedSocket() socket: any, @MessageBody() message: any){
        this._messageService.save(message);   
        const recipientSocketId = this._clients[message.recipientUserName];
        socket.to(recipientSocketId).emit("newMessageReceived", message.body);
    }    

}