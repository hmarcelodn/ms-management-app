// Framework
import * as amqp from "amqplib/callback_api";

export interface IEventHandler{
    handle(message: amqp.Message, channel: amqp.Channel): void;
}