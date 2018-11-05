import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { UpdateRideStatusMutationArgs, UpdateRideStatusResponse } from "../../../types/graph";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";
import Chat from "../../../entities/Chat";

const resolvers: Resolvers = {
    Mutation: {
        UpdateRideStatus: privateResolver(async (
            _,
            args: UpdateRideStatusMutationArgs,
            { req, pubSub }
        ) : Promise<UpdateRideStatusResponse> => {

            const user: User = req.user;
            // driver 가 상태를 변경할 수 있으므로 이때만 설정
            if(user.isDriving) {
                try {
                    let ride: Ride | undefined;
                    // status 요청이 ACCEPTED 라면 REQUESTING 상태인 것을 가져와서 수락해야 한다.
                    if(args.status === "ACCEPTED") {
                        ride = await Ride.findOne({
                            id: args.rideId, 
                            status: "REQUESTING"
                        }, {relations: ["passenger", "driver"]})

                        if(ride) {
                            // accepted 된다면 특정 특정 값들을 변경한다.
                            ride.driver = user;
                            user.isTaken = true;
                            user.save();

                            // accept 된다면 채팅방을 만들어서 대화할 수 있게 한다.
                            const chat = await Chat.create({
                                driver: user,
                                passenger: ride.passenger
                            }).save();

                            ride.chat = chat;
                            ride.save();
                        }

                        // 다른 status 라면 driver 만이 요청할 수 있게 된다.
                    } else {
                        ride = await Ride.findOne(
                            {
                                id: args.rideId,
                                driver: user
                            }, 
                            {relations: ["passenger", "driver"]}
                        );
                    }

                    if(ride) {
                        ride.status = args.status;
                        ride.save();
                        // state 가 update 되었음을 publish 한다.
                        pubSub.publish("rideUpdate", {RideStatusSubscription: ride});
                        return {
                            ok: true,
                            error: null,
                            rideId: ride.id
                        }
                    } else {
                        return {
                            ok: false,
                            error: "Can't update ride",
                            rideId: null
                        }
                    }
                } catch(error) {
                    return {
                        ok: false,
                        error: error.message,
                        rideId: null
                    }
                }
            } else {
                return {
                    ok: false,
                    error: "You are not driver",
                    rideId: null
                }
            }
        })
    }
}

export default resolvers;