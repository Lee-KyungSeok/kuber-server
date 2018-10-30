import { Resolvers } from "../../../types/resolvers";
import { StartPhoneVerificationMutationArgs, StartPhoneVerificationResponse } from "../../../types/graph";
import Verification from "../../../entities/Verification";
import { sendVerificationSMS } from "../../../utils/sendSMS";

const resolvers: Resolvers = {
    Mutation: {
        StartPhoneVerification: async (
            _, 
            args: StartPhoneVerificationMutationArgs
        ): Promise<StartPhoneVerificationResponse> => {
            const { phoneNumber } = args;
            try {
                // phoneNumber 가 존재한다면 지워준다.
                const existingVerfication = await Verification.findOne({payload: phoneNumber});
                if(existingVerfication) {
                    existingVerfication.remove();
                }
                // 새로운 verficiation 객체 생성
                const newVerification = await Verification.create({
                    payload: phoneNumber,
                    target: "PHONE"
                }).save();
                // verification 정보를 유저에게 전달
                await sendVerificationSMS(newVerification.payload, newVerification.key);
                return {
                    ok: true,
                    error: null
                };
            } catch(error) {
                return {
                    ok: false,
                    error: error.message
                }
            }
        }
    }
}

export default resolvers;