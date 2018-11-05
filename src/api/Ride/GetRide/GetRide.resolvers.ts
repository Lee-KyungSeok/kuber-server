import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import { GetRideQueryArgs, GetRideResponse } from "../../../types/graph";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
    Query: {
        GetRide: privateResolver(async(
            _,
            args: GetRideQueryArgs,
            { req }
        ) : Promise<GetRideResponse> => {
            const user: User = req.user;

            try {
                // 원래는 아래와 같이 ride 를 relation 을 주어 다른 테이블을 가져올 수 있다..
                // const ride = await Ride.findOne({
                //     id: args.rideId
                // }, {relations: ["passenger", "driver"]});

                const ride = await Ride.findOne(
                    {
                        id: args.rideId
                    }, 
                    { relations: ["passenger", "driver"] }
                );

                if(ride) {
                    // id 가 paassenger 혹은 driver 와 동일한지 확인
                    if(ride.passengerId === user.id || ride.driverId === user.id) {
                        return {
                            ok: true,
                            error: null,
                            ride
                        };
                    } else {
                        return {
                            ok: false,
                            error: "Not Authorized",
                            ride: null
                        };
                    }
                } else {
                    return {
                        ok: false,
                        error: "Ride not found",
                        ride: null
                    };
                }
            } catch (error) {
                return {
                    ok: false,
                    error: error.message,
                    ride: null
                };
            }
        })
    }
}

export default resolvers;