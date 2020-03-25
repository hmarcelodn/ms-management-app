// Framework
import { Service, Inject } from 'typedi';
import * as amqp from "amqplib/callback_api";

// Local
import { COMMAND_QUEUES, EXCHANGES } from './Constants';
import { ICommand } from '../command/ICommand';
import { IngestionCommandHandler } from '../commandHandler/IngestionCommandHandler';
import { SaveMessageCommandHandler } from '../commandHandler/SaveMessageCommandHandler';

@Service()
export class ServiceBus{
    private _channel: amqp.Channel;
    private _conn: amqp.Connection;

    @Inject()
    private _ingestionCommandHandler: IngestionCommandHandler;

    @Inject()
    private _saveMessageCommandHandler: SaveMessageCommandHandler;

    constructor(){
        this.initBus();
    }

    async initBus(){
        const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672/';

        amqp.connect(rabbitUrl, (err, conn) => {      
            
            if(err){
                console.log('[Service Bus]', err.message);
                return setTimeout(this.initBus.bind(this), 1000);
            }            

            conn.createChannel((err, ch) => {                
                console.log('[Service Bus]: Created');

                this._channel = ch;

                if(!err){		
                    this.assertExchanges()
                        .then(this.assertQueues.bind(this))
                        .then(this.bindingExchangesToQueues.bind(this))
                        .then(this.registerHandlers.bind(this));
                }

            });

            conn.on('error', () => {
                console.log('[Service Bus] failed');
                return setTimeout(this.initBus.bind(this), 1000);
            });        

            conn.on('close', () => {
                console.log('[Service Bus] reconnecting');
                return setTimeout(this.initBus.bind(this), 1000);
            });   

            this._conn = conn;

        });        
    }

    private assertExchanges(){
        return Promise.all([].concat(
            this._channel.assertExchange(EXCHANGES.EXCHANGE_COMMAND_GEOLOCALIZATION, 'direct', { durable: false })
        ));
    }

    private assertQueues(){
        return Promise.all([].concat(
            this._channel.assertQueue(COMMAND_QUEUES.QUEUE_COMMAND_INGESTION, { durable: false, exclusive: false }),
            this._channel.assertQueue(COMMAND_QUEUES.QUEUE_COMMAND_SAVE_MESSAGE, { durable: false, exclusive: false })            
        ));        
    }

    private bindingExchangesToQueues(){
        return Promise.all([].concat(
            this._channel.bindQueue(COMMAND_QUEUES.QUEUE_COMMAND_INGESTION, 
                                    EXCHANGES.EXCHANGE_COMMAND_GEOLOCALIZATION, 
                                    COMMAND_QUEUES.QUEUE_COMMAND_INGESTION, 
                                    { noAck: false, exclusive: false  }),

            this._channel.bindQueue(COMMAND_QUEUES.QUEUE_COMMAND_SAVE_MESSAGE, 
                                    EXCHANGES.EXCHANGE_COMMAND_GEOLOCALIZATION, 
                                    COMMAND_QUEUES.QUEUE_COMMAND_SAVE_MESSAGE, 
                                    { noAck: false, exclusive: false  })            
        ));
    }

    private registerHandlers(){
        this._channel.consume(COMMAND_QUEUES.QUEUE_COMMAND_INGESTION, (message: amqp.Message) => {
            this._ingestionCommandHandler.handle(message, this._channel);
        }); 

        this._channel.consume(COMMAND_QUEUES.QUEUE_COMMAND_SAVE_MESSAGE, (message: amqp.Message) => {
            this._saveMessageCommandHandler.handle(message, this._channel);
        });
    }

    async sendCommand(command: ICommand){
        const encodedPayload = JSON.stringify(command);
        this._channel.publish(EXCHANGES.EXCHANGE_COMMAND_GEOLOCALIZATION, command.name, new Buffer(encodedPayload));
    }

}