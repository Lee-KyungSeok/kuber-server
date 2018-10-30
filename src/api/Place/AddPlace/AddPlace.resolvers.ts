import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { AddPlaceMutationArgs, AddPlaceResponse } from "../../../types/graph";
import User from "../../../entities/User";
import Place from "../../../entities/Place";

const resolvers: Resolvers = {
    Mutation: {
        AddPlace: privateResolver( async (
            _, 
            args: AddPlaceMutationArgs, 
            { req }
        ) : Promise<AddPlaceResponse> => {
            const user: User = req.user;

            try {
                // 새로운 Place 를 만든다.
                await Place.create( { ...args, user }).save();

                return {
                    ok: true,
                    error: null
                }
            } catch(error) {
                return {
                    ok: false,
                    error: error.message
                }
            }
        })
    }
}

export default resolvers;