import { Resolvers } from "../../../types/resolvers";
import { CompletePhoneVerificationMutationArgs, CompletePhoneVerificationResponse } from "../../../types/graph";
import Verification from "../../../entities/Verification";
import User from "../../../entities/User";
import createJWT from "../../../utils/createJWT";

const resolvers: Resolvers = {
    Mutation: {
        CompletePhoneVerification: async (
            _, 
            args: CompletePhoneVerificationMutationArgs
        ): Promise<CompletePhoneVerificationResponse> => {
            const {phoneNumber, key} = args;
            try {
                const verification = await Verification.findOne({
                    payload: phoneNumber,
                    key
                });
                // verification 이 존재하지 않는다면 에러를 리턴
                // 존재한다면 verified 가 true 되었다고 설정한다.
                if(!verification) {
                    return {
                        ok: false,
                        error: "Verification key not valid",
                        token: null
                    };
                } else {
                    verification.verified = true;
                    verification.save();
                }
            } catch(error) {
                return {
                    ok: false,
                    error: error.message,
                    token: null
                };
            }

            // verification 이 존재한다면 phoneNumber 로 유저를 찾고
            // user 가 폰 인증이 되었음을 확인하고 결과를 리턴
            // 만약 user 가 없다면 토큰값을 던져주지 않는다.
            try {
                const user = await User.findOne({ phoneNumber });
                if(user) {
                    user.verifiedPhoneNumber = true
                    await user.save();
                    const token = createJWT(user.id);
                    return {
                        ok: true,
                        error: null,
                        token
                    }
                } else {
                    return {
                        ok: true,
                        error: null,
                        token: null
                    }
                }
            } catch(error) {
                return {
                    ok: false,
                    error: error.message,
                    token: null
                }
            };
        }
    }
}

export default resolvers;