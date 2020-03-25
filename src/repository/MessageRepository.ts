// Framework
import { EntityRepository, Repository } from "typeorm";

// Local
import { Message } from "../entity/Message";
import { IMessageRepository } from "../entity/repository/IMessageRepository";

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> implements IMessageRepository{
    
}