import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
    Subscription: {
        DriversSubscription: {
            // withFilter(resolver, filter) 를 통해 특정 조건의 유저에게만 socket 통신을 해야 한다.
            subscribe: withFilter(
                (_, __, { pubSub }) => {

                    // subscribe 는 pubSub instance 를 리턴하는 것 뿐이다.
                    // 그리고 이것을 context 와 공유한다.
                    // driverUpdate 이라는 채널의 변화를 관찰
                    return pubSub.asyncIterator("driverUpdate");
                },
                (payload, _, { context }) => {
                    // filter 사용 시 payload 와 context 를 가져올 수 있다. (방금 위치를 보고한 사용자가 전달된다)
                    // 그 안에서 특정 값들을 가져올 수 있다.
                    const user: User = context.currentUser;
                    const { 
                        DriversSubscription: { lastLat: driverLastLat, lastLng: driverLastLng } 
                    } = payload;

                    // 같은 이름을 할당할 수 없으므로 다른 이름으로 할당시킨다.
                    const { lastLat: userLastLat, lastLng: userLastLng } = user;

                    // 좌표 차이가 0.05 이하인 경우에만 subdcription 하게 한다.
                    return (
                        driverLastLat >= userLastLat - 0.05 &&
                        driverLastLat <= userLastLat + 0.05 &&
                        driverLastLng >= userLastLng - 0.05 &&
                        driverLastLng <- userLastLng + 0.05
                    );
                })
        }
    }
}

export default resolvers;