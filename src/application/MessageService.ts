// Framework
import { Service, Inject } from "typedi";
import { getCustomRepository } from "typeorm";

// Local
import { MessageRepository } from "../repository/MessageRepository";
import { Message } from "../entity/Message";
// import { ServiceBus } from "../insfrastructure/ServiceBus";
// import { SaveMessageCommand } from "../command/SaveMessageCommand";

@Service()
export class MessageService{

    // @Inject()
    // private _bus: ServiceBus;

    get(id: string):Promise<Message>{
        const messageRepository = getCustomRepository(MessageRepository);
        return messageRepository.findOne(id);
    }

    // save(message: any){
    //     const command: SaveMessageCommand = new SaveMessageCommand(message.body);
    //     this._bus.sendCommand(command);
    // }

    async save(message: any): Promise<Message>{
        const messageRepository = getCustomRepository(MessageRepository);

        let instance = new Message();
        instance.addMessage(message);

        return await messageRepository.save(instance);
    }
}