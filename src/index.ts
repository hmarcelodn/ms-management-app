// Framework
import "reflect-metadata";
import {useContainer, Action, createExpressServer} from "routing-controllers";
import {useContainer as useContainerSocket, useSocketServer, SocketIO} from 'socket-controllers';
import {createConnection, getCustomRepository} from "typeorm";
import {Container} from "typedi";
import * as jwt from "jsonwebtoken";
import * as bodyParser from  "body-parser";
import * as socketio from "socket.io";
// import * as redis from "socket.io-redis";
import * as express from "express";

// Local
// import { ServiceBus } from "./insfrastructure/ServiceBus";
// import { EventBus } from "./insfrastructure/EventBus";
import { GeoDatabase } from "./insfrastructure/GeoDatabase";
import { UserRepository } from "./repository/UserRepository";
import { GENERAL } from "./insfrastructure/Constants";
import { InitializerService } from "./application/InitializerService";
import { CustomErrorHandler } from "./middleware/CustomErrorHandler";

createConnection().then(async connection => {

    // Use DI
    useContainer(Container);
    useContainerSocket(Container);

    // Configure Express
    const port = process.env.PORT || 3000;

    // Setup express application 
    const app = createExpressServer({
        validation: true,
        routePrefix: "/api",
        middlewares: [
            CustomErrorHandler
        ],
        interceptors: [],      
        cors: true,
        controllers: [__dirname + '/controller/*.ts'],
        defaultErrorHandler: false,
        authorizationChecker: async (action: Action, roles: string[]) => {     
            try{
                const token = action.request.headers["authorization"];
                
                if(token){
                    let decodedToken: any = jwt.verify(token, GENERAL.ENCRYPTION_KEY); 

                    if(decodedToken){    
                        return true;                    
                    }
                }
                
                return false;
            }
            catch(e){
                return false;
            }
        },
        currentUserChecker: async (action: Action) => {
            const token = action.request.headers["authorization"];
            const userRepo = getCustomRepository(UserRepository);
            
            return await userRepo.getByToken(token);            
        }  
    });

    // Static files
    app.use(express.static('public'));

    // Encoded Url Middleware
    app.use(bodyParser.urlencoded());

    // Connect Express
    const server = app.listen(port, async () => {
        console.log(`Listening on port ${port}`);
        console.log("Initializing Services:");
        //const bus = Container.get(ServiceBus);
        //const eBus = Container.get(EventBus);
        const geo = Container.get(GeoDatabase);

        // Initialize Database Data
        const initializer = Container.get(InitializerService);
        await initializer.initializeCategories();
    }); 

    // Connect Websockets server
    const io = socketio(server);
    //io.adapter(redis({ host: process.env.REDIS_HOST || 'localhost', port: process.env.REDIS_PORT || 6379 }));

    // Connect Websockets
    useSocketServer(io, {
        controllers: [__dirname + '/ws-controller/*.ts']
    });

});