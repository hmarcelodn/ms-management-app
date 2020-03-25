# Running Universo App

**Prerequisites**:

 - Docker

**Local Start up**

The following start up Docker-compose which starts RabbitMQ, Redis, Tile38, Postgres and the Management API. It listens at http://localhost:3001/api/

    $ docker-compose -f docker-compose.yml up

**Architecture**

CQRS Base architecture.

 **Folder Structure**
 - application: Application Services layer.
 - command: Commands sent to Service Bus.
 - commandHandler: Consumes messages from RabbitMQ and process them.
 - controller: API JSON Controllers.
 - entity: Domain Entities.
 - event: Event sent to Service Bus as a Domain Event.
 - eventHandler: Consumes fanout messages and process them.
 - infrastructure: Contains Tile38, RabbitMQ, Logging, Swagger.
 - model: Input Models serialized in received requests.
 - repository: Contains a Entity root repository for database queries.
 - ws-controller: Web socket controllers.