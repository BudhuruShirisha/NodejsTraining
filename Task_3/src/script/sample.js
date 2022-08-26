/* const fetch = require("node-fetch")
const url = 'http://localhost:5000/organization/create'
const data = {
    x: 1920,
    y: 1080,
};
const customHeaders = {
    "Content-Type": "application/json",
}

fetch(url, {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
    }); */


/* const axios = require("axios")
axios.post('http://localhost:5000/organization/create', req.body)
    .then(res => console.log(res.data))
    .catch(err => console.log(err)) */

/* const axios = require("axios")

function makePostRequest(path, queryObj) {
    axios.post(path, queryObj).then(
        (response) => {
            var result = response.data;
            console.log(result.data);
        },
        (error) => {
            console.log(error);
        }
    );
}

queryObj = { name: 'Chitrank' };
makePostRequest('http://127.0.0.1:5000/test', queryObj); */

const fetch = require("node-fetch")

let todo = {
    userId: 123,
    title: "loren impsum doloris",
    completed: false
};

fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
    .then(json => console.log(json));