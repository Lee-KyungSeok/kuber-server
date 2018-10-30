// private resolver 를 currying 기법을 사용하여 보호할 것이다.
// resolver 로 받으므로 parent, args, context, info 의 네개의 인자가 들어오게 된다.
const privateResolver = resolverFunction => async (parent, args, context, info) => {
    // context 에 user 가 없으면 에러를 리턴한다.
    if(!context.req.user) {
        throw new Error("No JWT. I refuse to proceed");
    }
    // user 가 존재하면 미들웨어에 받은 resolver 실행하고 리턴한다.
    const resolved = await resolverFunction(parent, args, context, info);
    return resolved;
}

export default privateResolver;