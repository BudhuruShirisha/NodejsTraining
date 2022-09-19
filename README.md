# NodejsTraining

NodeJsRepo
Task1: NodeJsTask1 folder
Task 1: 2022-07-25
1) Create a sample express project, link this to your github repository.

2) write an api to get list of users from https://randomuser.me/ Method: Get, URL: localhost:3003/users/list?count=25 Validations: a) throw error when count is greater than 50. b) default count should be 10

3) Response: [ { id: <ssn number>, gender, title, fullname: <firstname> <lastname>, email, phone: phone || cell, dob: <YYYY-MM-DD>, age, address:{ line1, line2, city, state, zip } } ]

4) sort the list in name -asc order, age: desc order
  
  
// procedure 
=>  app.js file is configuring middlewares functions for users
=> In helpers we used to  function parse Json data.
=> routes folder we have users.js in that we are checking Validations and getting expected response from the controller and also sorting the data by age and name. 
controller folder use to get users data from random user generatorapi
=>  Endpoint: http://localhost:3003/Users/list //for getting default(10) users data from random user generator
=> based on how many users we want we can pass as query parameter
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
  
  
//******************************************************************************//

Task 3: 2022-08-01     (Task_3)
  Organization apis 
Create All CRUD APIs:
        a) POST: organization/
        b) GET:  organization/ (?id, status)
        c) PUT:  organization/:id
        d) DELETE: organization/:id

 Patient apis
Create All CRUD APIs:
        a) POST: patient/
        b) GET:  patient/ (?id, status, orgid)
        c) PUT:  patient/:id
        d) DELETE: patient/:id        
        
        
file APIs:
        a) Add file: /common/uploadfile
                {refid}
        b) remove file
                DELETE: common/deletefile/:id


Folder Structure:
        app.js
        routes
                common.js
                patient.js
                organization.js
        src
                patient
                        controller.js
                        patient.js
                organization
                        controller.js
                        organization.js
                common
                        file.js <both model & controller logic>
                db :  mongodb.js 
                                exports= { addRec(), updateRec(), delRec(), listRec()}
                                getSequence() to generate sequence id 20220801000000
                                should be used in addRec.
                config  :       app.spec.json, aws.js
        seed
                index.js to create seed data
       sequence:   {id, rectype:'sequence', type: 'sequence': data: '20220801000000'} 


  //procedure      
=> app.js file is configuring middlewares functions for patient and organization
=>creating patient and organization schema and validating the required fields and also inserting the record in the mongodb 
=>there is a common file for both organization and patient 

//***********************************************************************//
TASK - 4 (2022-08-09)           
contact 

        Methods inside contact.js 
                addAddress,addEmail,addFax,addPhone
                removeAddress,removeEmail,removeFax,removePhone
                updateAddress,updateEmail,updateFax,updatePhone
                
        contact API's:
        POST:  /organization/contact
        Body 
        {
                __action: addAddress,
                body:{
                        refid: patientid/organizationid,
                        type,
                        subtype,
                        address
                }
        }
        {
                __action: updateAddress,
                body:{
                        id: // contact id,
                        type,
                        subtype,
                        address
                }
        }

{
        __action: removeAddress,
        body:{
                id
        }
}

//************************************************************************//

Task 5 ---- (2022-08-19)

Collection Name -- user. (Main Schema Like Patient & Organization)

{
    id: { type: String },
    rectype: { type: String },
        orgid: { type: String }, // Office Id
    firstname: { type: String },
    lastname: { type: String },
    gender: { type: String, enum: Same as Patient },
    dob: { type: String }, same as Patient Format
    status: { type: String, enum: Same as Patient },
    created: { type: String },
        data: {}
}

Create All CRUD APIs:
        a) POST: user/
        b) GET:  user/ (?id, status, orgid)
        c) PUT:  user/:id
        d) DELETE: user/:id        


Collection Name  -- authentication (Common Schema like contact)
{
    id: { type: String },
    rectype: { type: String },
    orgid: { type: String }, // user orgid
    refrectype: { type: String, enum: ['user'] },
    refid: { type: String }, user id
    data: {
                username :  <Username to Login>
                password: Store encrypted Password String
        }
}

setAuth(payload){
        const {refid, username, password} = payload;
        remove if any old record exists for this user.
        create new authentication record.
}

