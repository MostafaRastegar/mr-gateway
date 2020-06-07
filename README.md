# mr-gateway
1 - install mongoDb on your system
2 - create "users" collection in mongoDb with this data:
``` js
[
  {
    userName: "john",
    userPassword: "password123admin",
    role: "admin",
    token: "youraccesstokensecret",
  },
  {
    userName: "anna",
    userPassword: "password123member",
    role: "member",
    token: "youraccesstokensecret",
  },
]
```
3 - create "transactions" collection in mongoDb
4 - `git clone https://github.com/MostafaRastegar/mr-gateway.git`
5 - `npm install` or `yarn`
6 - `npm start` or `yarn start`
