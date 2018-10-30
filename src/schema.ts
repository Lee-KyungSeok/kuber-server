// api 폴더 안의 모든 폴더들을 살펴본 후에 graphql 파일, resolvers 파일들을 
// 찾아서 app 에 전달한다.
// import { GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import path from "path";

// 모든 파일을 로드해서 any(GraphQLSchema) 배열 타입에 넣는다.
// 또한 fileLoader 패턴을 활용한다.
const allTypes: any[] = fileLoader(
    path.join(__dirname, "./api/**/*.graphql") // api 디렉토리에 있는 모든 graphsql 을 가져옴
)

const allResolvers: any[] = fileLoader(
    path.join(__dirname, "./api/**/*.resolvers.*") // ts 와 js 가 충돌나지 않게 하기 위해 .* 를 사용
)

const mergedTypes = mergeTypes(allTypes);
const mergedResolvers = mergeResolvers(allResolvers);

// makeExecutableSchema 은 schema 들을 하나로 합쳐주는 일을 한다.
const schema = makeExecutableSchema({
    typeDefs: mergedTypes,
    resolvers: mergedResolvers
});

export default schema;