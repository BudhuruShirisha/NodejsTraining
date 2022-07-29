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
Endpoint: http://localhost:3003/Users/list //for getting default(10) users data from random user generator
based on how many users we want we can pass as query parameter
Ex Endpoint: http://localhost:3003/Users/list?count=2

/***-------------------------------------------------------------------------------------------------------------------------------**/
  
  Task 2: (2022-07-27)
        
        a) localhost:3003 should display a page.
                
                Enter Valid Email: Text Box
                Subject: Text Box
                Message: Text Area
                
                Submit Button (Send Email)
                
        b) Endpoint :  localhost:3003/sendmail
                email format validation, all fields are required.
                Send Email using your gmail credentials.
        d) If email sent successfully, redirect to localhost:3003/success & show some success message.
                other wise redirect to localhost:3003/failed & show an error message.
Add home button in both success & failed pages. 
  
  Endpoint:localhost:3003 in which enter details to send the mail
   Post request: Endpoint:localhost:3003/sendmail
  validations are added in router file to validate the email using email validator module
  if it is success it will show success message or it fails shows error message
  
  
