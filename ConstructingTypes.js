var express = require('express');
var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');

// // 定义schema, 查询和类型
// var schema = buildSchema(`
//     type Account {
//         name: String
//         age: Int
//         sex: String
//         department: String
//         salary(city: String): Int
//     }

//     type Query {
//         getClassMates(classNo: Int!): [String],
//         account(username: String): Account
//     }
// `)

// // 定义查询对应的处理器
// var root = {
//     account: ({username}) => {
//         const name = username
//         const sex = 'man'
//         const age = 18
//         const department = '开发部'
//         const salary = ({city}) => {
//             if(['北京','上海','广州','深圳'].includes(city)) {
//                 return 10000
//             } else {
//                 return 3000
//             }
//         }
//         return {
//             name,
//             age,
//             sex,
//             department,
//             salary
//         }
//     }
// }

// -------------------------------改写-------------------------------
// 使用GraphQLObjectType定义type(类型)
var AccountType = new graphql.GraphQLObjectType({
    name: 'Account',
    fields: {
        name: { type: graphql.GraphQLString },
        age: { type: graphql.GraphQLInt },
        sex: { type: graphql.GraphQLString },
        department: { type: graphql.GraphQLString }
    }
})

// 使用GraphQLObjectType定义query(查询)
var queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        account: { // 方法名
            type: AccountType, // 方法的返回值
            args: {
                username: { type: graphql.GraphQLString } // 参数
            },
            resolve: function(_, {username}) { // 方法体
                const name = username
                const sex = 'man'
                const age = 18
                const department = '开发部'
                return {
                    name,
                    age,
                    sex,
                    department
                }
            }
        }
    }
})

// 创建schema
var schema = new graphql.GraphQLSchema({ query: queryType })

var app = express()

app.use('/graphql', graphqlHTTP({
    schema:schema,
    rootValue:root,
    graphiql:true
}))

app.listen(3000, () => {
    console.log('Server start on port 3000')
})

// 调用
// query{
//     account(username:"张三") {
//       name
//       age
//       sex
//       department
//     }
//   }