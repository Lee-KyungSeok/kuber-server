import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { GetNearbyRideResponse } from "../../../types/graph";
import User from "../../../entities/User";
import { getRepository, Between } from "typeorm";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
    Query: {
        GetNearbyRide: privateResolver(async(
            _, 
            __, 
            { req }
        ) : Promise<GetNearbyRideResponse> => {

            const user: User = req.user;
            // 드라이버인 경우에만 요청을 받도록 한다.
            if(user.isDriving) {
                const {lastLat, lastLng} = user;

                try {
                    const ride = await getRepository(Ride).findOne({
                        status: "REQUESTING",
                        pickUpLat: Between(lastLat - 0.05, lastLat + 0.05),
                        pickUpLng: Between(lastLng - 0.05, lastLng + 0.05)
                    });

                    // ride 가 있는 경우에는 ride 를 리턴하고 없는 경우에는 아무것도 반환 X 하지만 결과는 true
                    if(ride) {
                        return {
                            ok: true,
                            error: null,
                            ride
                        }
                    } else {
                        return {
                            ok: true,
                            error: null,
                            ride: null
                        }
                    }
    
                } catch (error) {
                    return {
                        ok: false,
                        error: error.message,
                        ride: null
                    }
                }
            } else {
                return {
                    ok: false,
                    error: "You are not a driver",
                    ride: null
                }
            }
        })
    }
}

export default resolvers;