export class COMMAND_QUEUES{
    public static QUEUE_COMMAND_INGESTION = "IngestionCommand";
    public static QUEUE_COMMAND_SAVE_MESSAGE = "SaveMessageCommand";
}

export class EVENT_QUEUES{
    public static DEVICE_LOCATION_UPDATED = "DeviceLocationUpdated";
    public static NEW_MESSAGE_RECEIVED = "NewMessageReceived"
}

export class EXCHANGES{
    public static EXCHANGE_COMMAND_GEOLOCALIZATION = "geolocalization.command.exchange";
    public static EXCHANGE_EVENT_GEOLOCALIZATION = "geolocalization.event.exchange";
}

export class GENERAL{
    public static ENCRYPTION_KEY = "ms.aes@2018.2019!";
    public static EXPIRATION_KEY = "80h";
    public static MAX_RETRY_LOGIN = 3;
}

export class MESSAGES {
    public static SUCESS = "Success";
    public static INVALID_CREDENTIALS = "Invalid Credentials";
    public static BLACK_LIST_USER = "User is disabled in blacklist";
    public static EXISTING_USER = "The user already exists";
}

export class ERRORS{
    public static INVALID_CATEGORY = "Invalid Category";
}