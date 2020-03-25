// Framework
import { Service } from "typedi";
import { getCustomRepository } from "typeorm";
import * as amqp from "amqplib/callback_api";

// Local
import { ICommandHandler } from "./ICommandHandler";
import { MessageRepository } from "../repository/MessageRepository";
import { Message } from "../entity/Message";

@Service()
export class SaveMessageCommandHandler implements ICommandHandler{    

    async handle(message: amqp.Message, channel: amqp.Channel): Promise<void> {
        const decodedPayload = JSON.parse(message.content.toString());
        const messageRepository = getCustomRepository(MessageRepository);

        let instance = new Message();
        instance.addMessage(decodedPayload.message);

        await messageRepository.save(instance);

        channel.ack(message);     
    }
}