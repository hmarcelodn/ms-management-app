// Framework
import { Inject, Service } from "typedi";
import * as amqp from "amqplib/callback_api";

// Local
import { ICommandHandler } from "./ICommandHandler";
import { GeoDatabase } from "../insfrastructure/GeoDatabase";
import { EventBus } from "../insfrastructure/EventBus";
import { DeviceLocationUpdated } from "../event/DeviceLocationUpdated";
import { IngestionCommand } from "../command/IngestionCommand";
import { IngestionModel } from "../model/IngestionModel";

@Service()
export class IngestionCommandHandler implements ICommandHandler{

    @Inject()
    private _geoDb: GeoDatabase;

    @Inject()
    private _eventBus: EventBus;

    async handle(message: amqp.Message, channel: amqp.Channel): Promise<void> {
        const decodedPayload: IngestionCommand = JSON.parse(message.content.toString());

        const deviceCoords: IngestionModel = {
            latitude: decodedPayload.latitude,
            longitude: decodedPayload.longitude,
            deviceId: decodedPayload.deviceId
        };

        const deviceLocationUpdatedEvent = new DeviceLocationUpdated(
            decodedPayload.latitude,
            decodedPayload.longitude,
            decodedPayload.deviceId
        );

        this._geoDb.setCoordinates(deviceCoords);
        this._eventBus.sendEvent(deviceLocationUpdatedEvent);

        channel.ack(message);
    }
}