// args 에 key 가 있다면 notNull 에 넣고 update 한다.
const cleanNullArgs = (args : object): object => {
    const notNull = {};
    Object.keys(args).forEach(key => {
        if(args[key] !== null) {
            notNull[key] = args[key];
        }
    });

    return notNull;
}

export default cleanNullArgs;