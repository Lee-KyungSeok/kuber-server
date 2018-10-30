import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import Verification from "../../../entities/Verification";
import User from "../../../entities/User";
import { sendVerificationEmail } from "../../../utils/sendEmail";
import { RequestEmailVerificationResponse } from "../../../types/graph";

const resolvers: Resolvers = {
    Mutation: {
        RequestEmailVerification: privateResolver(async(_, __, {req}): Promise<RequestEmailVerificationResponse> => {
            const user: User = req.user;
            // 만약, 이메일이 있다면 이미 인증된 정보는 제거하고 다시 인증 메일을 보내도록 한다.
            // 이미 인증된 유저라면 verification 을 보내지 않는다.
            if(user.email && !user.verifiedEmail) {
                try {
                    const oldVerification = await Verification.findOne({ payload: user.email });
                    if(oldVerification) {
                        oldVerification.remove();
                    }
                    const newVerification = await Verification.create({
                        payload: user.email,
                        target: "EMAIL"
                    }).save();
                    await sendVerificationEmail(user.fullName, newVerification.key);
                    return {
                        ok: true,
                        error: null
                    }
                } catch(error) {
                    return {
                        ok: false,
                        error: error.message
                    }
                }
            } else {
                return {
                    ok: false,
                    error: "Your user has no email to verify"
                }
            }
        })
    }
}

export default resolvers;