import dotenv from "dotenv";
// dotenv 로 환경변수 설정을 쉽게 할 수 있다.(.env 를 바로 해준다.)
// ormConfig 전에 실행이 되어야 적용이 됨에 주의하자.
dotenv.config();

import { Options } from "graphql-yoga";
import {createConnection} from "typeorm";
import app from "./app";
import connectionOptions from "./ormConfig";
import decodeJWT from "./utils/decodeJWT";

console.log(process.env);
const PORT : number | string = process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT : string = "/playground"; // playground url 주소라고 생각!
const GRAPHQL_ENDPOINT : string = "/graphql" // graphql 의 url 은 단일 endpoint 이다.
const SUBSCRIPTION_ENDPOINT: string = "/subscription";

const appOptions: Options = {
    port: PORT,
    playground: PLAYGROUND_ENDPOINT,
    endpoint: GRAPHQL_ENDPOINT,
    subscriptions: {
        path: SUBSCRIPTION_ENDPOINT,
        onConnect: async (connectionParams) => {
            // websocket 사용을 위해 user 를 token 으로 커넥션을 유지시켜 준다.
            // 연결되면 currentUser 로 subscription resolvers 의 context 에 추가시켜준다. (req.connection.context.currentUser)
            const token = connectionParams['X-JWT'];

            // 만약 token 혹은 user 가 없다면 user 를 연결하지 않는다.
            if(token) {
                const user = await decodeJWT(token);
                if(user) {
                    return {
                        currentUser: user
                    }
                }
            } 
            throw new Error("No JWT. Can't subscribe");
        }
    }
}

const handleAppStat = () => console.log(`Listening on port ${PORT}`);

createConnection(connectionOptions).then(() => {
    // app.start 는 option 과 callback 을 받는다.
    app.start(appOptions, handleAppStat);
}).catch(error => console.log(error));
