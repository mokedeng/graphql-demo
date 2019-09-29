var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
    type Account {
        name: String
        age: Int
        sex: String
        department: String
    }

    type Query {
        hello: String,
        accountName: String,
        age: Int,
        account: Account
    }
`)

var root = {
    hello: () => {
        return 'hello world';
    },
    accountName: () => {
        return '邓艳'
    },
    age: () => {
        return 20
    },
    account: () => {
        return {
            name: '张三',
            age: 18,
            sex: '男',
            department: '测试部',
        }
    }
}

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
//     hello
//     accountName
//     age
//     account {
//       name
//       age
//       sex
//       department
//     }
//   }