import { Resolvers } from "../../../types/resolvers";
import { EmailSignUpResponse, EmailSignUpMutationArgs } from "../../../types/graph";
import User from "../../../entities/User";
import createJWT from "../../../utils/createJWT";
import Verification from "../../../entities/Verification";
import { sendVerificationEmail } from "../../../utils/sendEmail";

const resolvers: Resolvers = {
    Mutation: {
        EmailSignUp: async (
            _, 
            args: EmailSignUpMutationArgs
        ): Promise<EmailSignUpResponse> => {
            const { email } = args;
            // user 가 존재한다면 로그인하라고 요청하고
            // 존재하지 않는다면 user 를 생성한다.
            try {
                const existingUser = await User.findOne({ email });
                if(existingUser) {
                    return {
                        ok: false,
                        error: "You should log in instaed",
                        token: null
                    }
                } else {
                    // 폰 인증이 되어 있는 경우에만 이메일 인증을 진행할 것임
                    const phoneVerification = await Verification.findOne({
                        payload: args.phoneNumber,
                        verified: true
                    });

                    if(phoneVerification) {
                        const newUser = await User.create({...args}).save();
                        if(newUser.email) {
                            const emailVerification = await Verification.create({
                                payload: newUser.email,
                                target: "EMAIL"
                            }).save();
                            await sendVerificationEmail(newUser.fullName, emailVerification.key);
                        }
                        const token = createJWT(newUser.id);
                        return {
                            ok: true,
                            error: null,
                            token
                        }
                    } else {
                        return {
                            ok: false,
                            error: "You haven't verified your phone number",
                            token: null
                        }
                    }
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
}

export default resolvers;