import jwt from "jsonwebtoken";

// user_id 를 받고, token 안에 넣어서 user_id 를 암호화 한 후
// 이걸 user 에게 전달해 줄 것이다. (strong passowrd generator 에서 secret 을 생성함)
const createJWT = (id: number): string => {
    const token = jwt.sign(
        {
            id
        }, 
        process.env.JWT_TOKEN || ""
    );

    return token;
};

export default createJWT;