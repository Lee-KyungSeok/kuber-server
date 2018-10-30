import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { EditPlaceMutationArgs, EditPlaceResponse } from "../../../types/graph";
import User from "../../../entities/User";
import Place from "../../../entities/Place";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: Resolvers = {
    Mutation: {
        EditPlace : privateResolver(async (
            _, 
            args : EditPlaceMutationArgs, 
            {req}
        ) : Promise<EditPlaceResponse> => {

            const user: User = req.user;

            try {
                const place = await Place.findOne({id: args.placeId});
                if(place) {
                    // user 의 아이디가 일치하는지 확인
                    if(place.userId == user.id) {
                        const notNull = cleanNullArgs(args);
                        await Place.update({ id: args.placeId}, { ...notNull });
                        return {
                            ok: true,
                            error: null
                        }
                    } else {
                        return {
                            ok: false,
                            error: "Not Authorized"
                        }
                    }
                } else {
                    return {
                        ok: false,
                        error: "Place not found"
                    }
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