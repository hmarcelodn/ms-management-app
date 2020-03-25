// Framework
import { Service } from 'typedi';
import * as amqp from "amqplib/callback_api";

// Local
import { EVENT_QUEUES, EXCHANGES } from './Constants';
import { IEvent } from '../event/IEvent';

@Service()
export class EventBus{
    private _channel: amqp.Channel;
    private _conn: amqp.Connection;

    constructor(){
        this.initBus();
    }

    async initBus(){
        const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672/';

        amqp.connect(rabbitUrl, (err, conn) => {

            if(err){
                console.error("[Event Bus]", err.message);
                return setTimeout(this.initBus.bind(this), 1000);
            }            

            conn.createChannel((err, ch) => {                
                console.log('[Event Bus] Created');

                this._channel = ch;

                if(!err){		
                    this.assertExchanges()
                        .then(this.assertQueues.bind(this))
                        .then(this.bindingExchangesToQueues.bind(this))
                        .then(this.registerHandlers.bind(this));              
                }
            });

            conn.on("error", () => {
                console.log("[Event Bus] reconnecting");
                return setTimeout(this.initBus.bind(this), 1000);
            });

            conn.on("close", () => {
                console.log("[Event Bus] reconnecting");
                return setTimeout(this.initBus.bind(this), 1000);
            });

            this._conn = conn;

        });        
    }   

    private assertExchanges(){
        return Promise.all([].concat(
            this._channel.assertExchange(EXCHANGES.EXCHANGE_EVENT_GEOLOCALIZATION, 'direct', { durable: false })
        ));        
    }

    private assertQueues(){
        return Promise.all([].concat(
            this._channel.assertQueue(EVENT_QUEUES.DEVICE_LOCATION_UPDATED, { durable: false, exclusive: false })        
        ));       
    }

    private bindingExchangesToQueues(){
        return Promise.all([].concat(
            this._channel.bindQueue(EVENT_QUEUES.DEVICE_LOCATION_UPDATED, EXCHANGES.EXCHANGE_EVENT_GEOLOCALIZATION, '', { noAck: false, exclusive: false  })        
        ));
    }

    private registerHandlers(){}
    
    async sendEvent(event: IEvent){
        const encodedPayload = JSON.stringify(event);
        this._channel.publish(EXCHANGES.EXCHANGE_EVENT_GEOLOCALIZATION, event.name, new Buffer(encodedPayload));
    }
}