import jwt from "jsonwebtoken";
import User from "../entities/User";

// token 을 가지고 verify 하여
// user 가 존재하면 user 를, 존재하지 않는다면 undefined 를 리턴시킨다.
const decodeJWT = async (token: string) : Promise<User | undefined> => {
    try {
        // verify 하면 jwt 에서 넣었던 id 를 리턴해준다.
        const decoded: any = jwt.verify(token, process.env.JWT_TOKEN || "");
        const { id } = decoded;
        const user = await User.findOne({ id });
        return user;
    } catch(error) {
        return undefined;
    }
};

export default decodeJWT;