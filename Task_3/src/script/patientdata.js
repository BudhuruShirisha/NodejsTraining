const fetch = require("node-fetch")
const datechange = require("date-and-time");

async function getdetails(count) {

    const url = "https://randomuser.me/api/?results="
    try {
        const res = await fetch(url + count); //fetching the url from random user
        const users = await res.json();
        const data = await users.results;
        const userList = []; //getting the userdetails in userlist
        await data.forEach(userObj => {
            userList.push(parsingDataJson(userObj)); //userobject is passed to function
        });
        //  order.orderBy(userList, ['first', 'age'], ['asc', 'desc']);
        //  console.log(userList);
        await res.json(userList);

    } catch (err) {
        console.log(err)
        throw err;
    }
}
getdetails(4);

function parsingDataJson(Object) {
    const {
        gender,
        name: {
            title,
            first,
            last
        },
        dob: {
            date,
            age
        },
    } = Object

    const dob = datechange.format((new Date(date)), 'YYYY-MM-DD');
    const responseData = {
        gender,
        first,
        last,
        title,
        dob,
        age,
    }
    return responseData;
}