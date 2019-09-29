var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// 定义schema, 查询和类型
var schema = buildSchema(`
    type Account {
        name: String
        age: Int
        sex: String
        department: String
        salary(city: String): Int
    }

    type Query {
        getClassMates(classNo: Int!): [String],
        account(username: String): Account
    }
`)

// 定义查询对应的处理器
var root = {
    getClassMates: ({classNo}) => {
        const obj = {
            31: ['张1', '张2', '张3'],
            61: ['李1', '李2', '李3']
        }
        return obj[classNo];
    },
    account: ({username}) => {
        const name = username
        const sex = 'man'
        const age = 18
        const department = '开发部'
        const salary = ({city}) => {
            if(['北京','上海','广州','深圳'].includes(city)) {
                return 10000
            } else {
                return 3000
            }
        }
        return {
            name,
            age,
            sex,
            department,
            salary
        }
    }
}

var app = express()

app.use('/graphql', graphqlHTTP({
    schema:schema,
    rootValue:root,
    graphiql:true
}))

// 公开文件夹，供用户访问静态资源
app.use(express.static('public'))

app.listen(3000, () => {
    console.log('Server start on port 3000')
})

// 调用
// query{
//     getClassMates(classNo:31),
//     account(username:"张1"){
//       name,
//       age,
//       sex,
//       department,
//       salary(city:"北京")
//     }
//   }