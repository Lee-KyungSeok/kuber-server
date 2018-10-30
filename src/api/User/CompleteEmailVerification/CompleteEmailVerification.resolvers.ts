import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import { CompleteEmailVerificationMutationArgs, CompleteEmailVerificationResponse } from "../../../types/graph";
import Verification from "../../../entities/Verification";

const resolvers: Resolvers = {
    Mutation: {
        CompleteEmailVerification: privateResolver(
            async(_, __, args: CompleteEmailVerificationMutationArgs, { req }
            ) : Promise<CompleteEmailVerificationResponse> => {

                const user: User = req.user;
                const { key } = args;
                if(user.email) {
                    try {
                        const verificatoin = await Verification.findOne({ key, payload: user.email });
                        if(verificatoin) {
                            user.verifiedEmail = true;
                            await user.save();
                            return {
                                ok: true,
                                error: null
                            }
                        } else {
                            return {
                                ok: false,
                                error: "Can't verify email"
                            }
                        }
                    } catch(error) {
                        return {
                            ok: false,
                            error: error.message
                        };
                    }
                } else {
                    return {
                        ok: false,
                        error: "No email to verify"
                    };
                }
        })
    }
}

export default resolvers;