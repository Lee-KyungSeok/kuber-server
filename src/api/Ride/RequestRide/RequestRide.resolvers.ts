import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { RequestRideResponse, RequestRideMutationArgs } from "../../../types/graph";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
    Mutation: {
        RequestRide: privateResolver(async(
            _, 
            args: RequestRideMutationArgs, 
            { req, pubSub }
        ) : Promise<RequestRideResponse> => {
            
            const user: User = req.user;

            // user 가 riding 및 driver 가 아닌 경우에만 요청을 보낸다.
            if(!user.isRiding && !user.isDriving) {
                try {
                    const ride = await Ride.create({...args, passenger: user}).save();
                    
                    // publish 해서 픽업을 알려줌
                    pubSub.publish("rideRequest", {NearbyRideSubscription: ride})

                    // request 가 되면 riding 을 true 로 변환
                    user.isRiding = true;
                    user.save();
                    
                    return {
                        ok: true,
                        error: null,
                        ride
                    }
                } catch(error) {
                    return {
                        ok: false,
                        error: error.message,
                        ride: null
                    }
                }
            } else {
                return {
                    ok: false,
                    error: "You can't request two rides or drive and request",
                    ride: null
                }
            }
        })
    }
}

export default resolvers;