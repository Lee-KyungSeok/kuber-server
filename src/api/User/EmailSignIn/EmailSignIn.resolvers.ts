import { Resolvers } from "../../../types/resolvers";
import { EmailSignInMutationArgs, EmailSignInResponse } from "../../../types/graph";
import User from "../../../entities/User";
import createJWT from "../../../utils/createJWT";

const resolvers: Resolvers = {
    Mutation: {
        EmailSignIn: async (
            _, 
            args: EmailSignInMutationArgs
        ): Promise<EmailSignInResponse> => {
            const {email, password} = args;
            try {
                const user = await User.findOne({ email });
                // 유저가 없다면 없다고 전달
                if(!user) {
                    return {
                        ok: false,
                        error: "No User found with that email",
                        token: null
                    };
                }
                // password 를 비교하여 응답
                const checkPassword = await user.comparedPassword(password);
                if(checkPassword) {
                    const token = createJWT(user.id);
                    return {
                        ok: true,
                        error: null,
                        token
                    };
                } else {
                    return {
                        ok: false,
                        error: "Wrong password",
                        token: null
                    }
                }
            } catch(error) {
                return {
                    ok: false,
                    error: error.message,
                    token: null
                };
            }
        }
    }
};

export default resolvers;