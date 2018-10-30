import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import { GetNearbyDriversResponse } from "../../../types/graph";
import { Between, getRepository } from "typeorm";

const resolvers: Resolvers = {
    Query: {
        GetNearbyDrivers: privateResolver(async (
            _,
            __,
            { req }
        ) : Promise<GetNearbyDriversResponse> => {
            const user: User = req.user;
            const { lastLat, lastLng } = user;

            try {
                // operation (between) 을 작동시키기 위해서는 repository 가 필요하다.
                const drivers: User[] = await getRepository(User).find({
                    isDriving: true,
                    lastLat: Between(lastLat - 0.05, lastLat + 0.05), // value 의 사이에 있는 값을 찾아준다.
                    lastLng: Between(lastLng - 0.05, lastLng + 0.05)
                });

                return {
                    ok: true,
                    error: null,
                    drivers
                };

            } catch(error) {
                return {
                    ok: false,
                    error: error.message,
                    drivers: null
                };
            }
        })
    }
}

export default resolvers;