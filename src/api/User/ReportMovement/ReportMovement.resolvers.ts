import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { ReportMovementMutationArgs, ReportMovementResponse } from "../../../types/graph";
import User from "../../../entities/User";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: Resolvers = {
    Mutation: {
        ReportMovement: privateResolver(async (
            _, 
            args: ReportMovementMutationArgs, 
            { req, pubSub }
        ) : Promise<ReportMovementResponse> => {
            
            const user: User = req.user;
            const notNull = cleanNullArgs(args);
            
            try {
                await User.update({id: user.id}, { ...notNull });
                const updatedUser = await User.findOne({id: user.id});

                // publish 를 할때는 subscriptio 이름과 payload 가 필요하다.
                // 여기서 payload 는 DriversSubscription 로 설정되었으므로 이를 설정해준다. (이름은 반드시 동일해야 한다)
                pubSub.publish("driverUpdate", {DriversSubscription: updatedUser})

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