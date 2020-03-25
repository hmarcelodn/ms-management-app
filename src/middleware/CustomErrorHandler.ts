import {Middleware, ExpressErrorMiddlewareInterface} from "routing-controllers";
import bugsnag from '@bugsnag/js'
import bugsnagExpress from '@bugsnag/plugin-express'

const bugsnagClient = bugsnag({
    apiKey: 'b4c8f4e402e59794264b6b295a8c3529',
    appVersion: '1.0.0',
    appType: 'web_server',
    releaseStage: 'experimental'
});

bugsnagClient.use(bugsnagExpress);

@Middleware({ type: "after" })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next: (err: any) => any) {
        console.log("[Unhandled Exception Caugth by Middleware]: ");
        console.log(error);
        bugsnagClient.notify(error);
        next(null);
    }

}