import User from "../../../entities/User";
import { Resolvers } from "../../../types/resolvers";
import { FacebookConnectMutationArgs, FacebookConnectResponse } from "../../../types/graph";
import createJWT from "../../../utils/createJWT";

const resolvers: Resolvers = {
    Mutation: {
        FacebookConnect: async(
            _, 
            args: FacebookConnectMutationArgs
        ): Promise<FacebookConnectResponse> => {
            const { fbId } = args;
            try {
                // 유저가 존재하면 아래를 실행할테고 존재하지 않으면 try~catch 문을 나가서 실행하게 된다.
                const existingUser = await User.findOne({ fbId })
                if(existingUser) {
                    const token = createJWT(existingUser.id);
                    return {
                        ok: true,
                        error: null,
                        token
                    };
                }
            } catch(error) {
                return {
                    ok: false,
                    error: error.message,
                    token: null
                };
            }
            // 유저가 존재하지 않는다면 생성, 저장 후 응답
            try {
                const newUser = await User.create({
                     ...args, 
                     profilePhoto: `http://graph.facebook.com/${fbId}/picture?type=square`
                }).save();
                const token = createJWT(newUser.id);
                return {
                    ok: true,
                    error: null,
                    token
                }
            } catch(error) {
                return {
                    ok: false,
                    error: error.message,
                    token: null
                }
            }
        }
    }
};

export default resolvers;