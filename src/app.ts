import { NextFunction, Response } from "express";
import { GraphQLServer, PubSub } from "graphql-yoga";
import cors from "cors";
import logger from "morgan"
import helmet from "helmet"
import schema from "./schema"
import decodeJWT from "./utils/decodeJWT";

// 설정 파일이 될 것
class App {
    public app: GraphQLServer;
    public pubSub: any;
    constructor() {
        // subsription 을 위한 pubSub 설정 (제품화 단계에서는 redies 나 mem cached 같은 것을 써야 한다.)
        this.pubSub = new PubSub();
        this.pubSub.ee.setMaxListeners(99);
        this.app = new GraphQLServer({
            schema,
            // resolver 에서 context 에 넘겨줄 수 있는데 여기서 request 를 넘겨주었다.
            // pubSub 는 context 에 넘겨주도록 설정한다.
            context: req => {
                // connection 안에 context 가 있으며 null 가능성이 있고 connection 은 empty 일 수 있다. (디폴트 값을 준 것)
                const {connection: {context = null} = {}} = req;
                return {
                    req: req.request,
                    pubSub: this.pubSub,
                    context
                }
            }
        })
        this.middlewares();
    }

    // graphql-yoga 는 express 를 가지고 있기 때문에 여기에 middleware 를 추가할 수 있다.
    private middlewares = () : void => {
        this.app.express.use(cors());
        this.app.express.use(logger("dev"));
        this.app.express.use(helmet());
        this.app.express.use(this.jwt); // 커스텀한 미들웨어를 적용
    }

    // jwt 를 위한 middleware 설정 (header 에 X-JWT 에 토큰을 저장할 것이니까 여기서 가져온다.)
    private jwt = async (req, res: Response, next: NextFunction): Promise<void> => {
        const token = req.get("X-JWT");
        if(token) {
            const user = await decodeJWT(token);
            // request 의 user 프로퍼티에다가 db 에서 찾은 user 를 넣어서 던져준다.
            if(user) {
                req.user = user;
            } else {
                req.user = undefined;
            }
        }
        next();
    }
}

export default new App().app;