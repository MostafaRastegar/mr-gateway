# mr-gateway
* 1  - install mongoDb on your system
* 2  - create "users" collection in mongoDb with this data:
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
* 3  - create "transactions" collection in mongoDb
* 4  - `git clone https://github.com/MostafaRastegar/mr-gateway.git`
* 5  - `cp .env-example .env`
* 6  - `npm install` or `yarn`
* 7  - `npm start` or `yarn start`
* 8  - you can view users table on localhost:4002/users
* 9  - you can view transactions table on localhost:4002/transactions
* 10 - for view checkout page demo, clone and install `https://github.com/MostafaRastegar/mr-checkout.git`
