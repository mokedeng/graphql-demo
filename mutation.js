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