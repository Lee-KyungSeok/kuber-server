import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { UpdateMyProfileMutationArgs, UpdateMyProfileResponse } from "../../../types/graph";
import User from "../../../entities/User";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: Resolvers = {
    Mutation: {
        UpdateMyProfile: privateResolver(
            async (
                _, 
                args: UpdateMyProfileMutationArgs, 
                { req }
            ): Promise<UpdateMyProfileResponse> => {

            const user: User = req.user;
            // args 에 key 가 있다면 notNull 에 넣고 update 한다. (모듈로 뺌)
            const notNull: any = cleanNullArgs(args);
            
            // update 시에 beforeUpdate 는 instance 를 변경하지 않으므로 호출되지 않는다. 따라서 이를 설정해주어야 한다.
            if(notNull.password !== null) {
                user.password = notNull.password;
                await user.save();
                delete notNull.password; // password 를 지워주어야 update 할때 적용되지 않는다,
            }

            try {
                await User.update({id: user.id}, { ... notNull})
                return {
                    ok: true,
                    error: null
                }
            } catch (error) {
                return {
                    ok: false,
                    error: error.message
                }
            }
        })
    }
}

export default resolvers;