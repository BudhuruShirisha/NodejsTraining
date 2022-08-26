const fetch = require("node-fetch")
const axios = require('axios')
const datechange = require("date-and-time");
const config = require("../config/app.sepc.json")

async function getdetails() {
    try {
        const users = await getrandomuserdetails(4);
        const data = users.results;
        const userList = [];
        data.forEach(userObj => {
            userList.push(parsingDataJson(userObj));
        });

        const token = await setauthorization("http://localhost:5000/user/login")
        const patientInfo = await createPatient('http://localhost:5000/patient/create', userList, token);
        console.log(patientInfo);
    } catch (err) { console.log("err") }
}
async function getrandomuserdetails(count) {
    try {
        const url = "https://randomuser.me/api/?results="
        const res = await fetch(url + count);
        const users = await res.json();
        //console.log(users.results)
        return users;

    } catch (error) {
        console.log("error")
    }
}
async function createPatient(path, userList, token) {
    return new Promise((resolve, reject) => {
        try {

            const user = userList.map((userObj) => {
                userObj.orgid = "20220801000001";
                return axios.post(path, userObj, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            });
            Promise.all(user).then((result) => {
                resolve(result);
            });
        } catch (error) {
            console.log(error.response);
        }
    });
}

async function setauthorization(path) {
    try {
        const user = {
            username: "budhuruShirisha",
            password: "Siri@6789"
        }
        const tokenInfo = await axios.post(path, user)
            // console.log(tokenInfo.data.results)
        return tokenInfo.data.results;
    } catch (error) {
        console.log(error);
    }

}

function parsingDataJson(Object) {
    const {
        gender,
        name: {
            title,
            first: firstname,
            last: lastname
        },
        dob: {
            date,
            age
        },
    } = Object

    const dob = datechange.format((new Date(date)), 'YYYY-MM-DD');
    const responseData = {
        gender,
        firstname,
        lastname,
        title,
        dob,
        age,
    }
    return responseData;
}
getdetails();