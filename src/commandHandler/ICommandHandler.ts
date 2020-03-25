// Framework
import * as amqp from "amqplib/callback_api";

// Local
import { ICommand } from "../command/ICommand";

export interface ICommandHandler{
    handle(message: amqp.Message, channel: amqp.Channel): Promise<void>;
}