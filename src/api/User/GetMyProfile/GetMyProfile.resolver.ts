import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
    Query: {
        // GetMyProfile 은 context 애 들어오는 user (req 에 있음) 로 파악하도록 한다.
        // 함수형 방식을 사용하여 authResolver 에서 먼저 에러체크를 하고 그 다음 user 를 확인한다.
        GetMyProfile: privateResolver(async (_, __, {req}) => {
            const { user } = req;
            return {
                ok: true,
                error: null,
                user
            };
        })
    }
};

export default resolvers;