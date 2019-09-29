var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
    input AccountInput {
        name: String
        age: Int
        sex: String
        department: String
    }

    type Account {
        name: String
        age: Int
        sex: String
        department: String
    }

    type Mutation {
        createAccount(input:AccountInput):Account
        updateAccount(id: ID!, input: AccountInput):Account
    }

    type Query {
        accounts: [Account]
    }
`)

const fakeDb = {};

var root = {
    accounts(){
        const arr = [];
        for (const key in fakeDb) {
            arr.push(fakeDb[key])
        }
        return arr;
    },
    createAccount({input}) {
        fakeDb[input.name] = input;
        return fakeDb[input.name];
    },
    updateAccount({id, input}) {
        const updateAccount = Object.assign({}, fakeDb[id], input);
        fakeDb[id] = updateAccount;
        return updateAccount;
    }
}

var app = express()

// 中间件，一般会用JWT插件做权限验证
// 访问 http://localhost:3000/graphql 会给出错误提示
// 谷歌浏览器 F12 选择Application 添加一个cookie auth即可看到页面
const middleware = (req, res, next) => {
    if(req.url.indexOf('/graphql') !== -1 && req.headers.cookie.indexOf('auth') === -1) {
        res.send(JSON.stringify({
            error:"您没有权限访问这个接口"
        }))
        return;
    }
    next();
}

app.use(middleware);

app.use('/graphql', graphqlHTTP({
    schema:schema,
    rootValue:root,
    graphiql:true
}))

app.listen(3000, () => {
    console.log('Server start on port 3000')
})

// 调用
// mutation {
//     createAccount(input:{
//       name:"李1",
//       sex: "man",
//       age: 18,
//       department:"测试部"
//     }) {
//       name
//       age
//       sex
//       department
//     }
//   }
  
//   mutation {
//     updateAccount(id:"李1",input:{
//       age: 100
//     }) {
//       name
//       age
//       sex
//       department
//     }
//   }
  
//   query {
//     accounts {
//       name
//       age
//       sex
//       department
//     }
//   }