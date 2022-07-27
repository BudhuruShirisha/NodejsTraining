# NodejsTraining

NodeJsRepo
Task1: NodeJsTask1 folder
Task 1: 2022-07-25
1) Create a sample express project, link this to your github repository.

2) write an api to get list of users from https://randomuser.me/ Method: Get, URL: localhost:3003/users/list?count=25 Validations: a) throw error when count is greater than 50. b) default count should be 10

3) Response: [ { id: <ssn number>, gender, title, fullname: <firstname> <lastname>, email, phone: phone || cell, dob: <YYYY-MM-DD>, age, address:{ line1, line2, city, state, zip } } ]

4) sort the list in name -asc order, age: desc order
  
  
// procedure 
app.js file is configuring middlewares functions for users
In helpers we used to  function parse Json data.
routes folder we have users.js in that we are checking Validations and getting expected response from the controller and also sorting the data by age and name. 
controller folder use to get users data from random user generatorapi
Endpoint: http://localhost:3000/Users/list //for getting default(10) users data from random user generator
based on how many users we want we can pass as query parameter
Ex Endpoint: http://localhost:3000/Users/list?count=2

