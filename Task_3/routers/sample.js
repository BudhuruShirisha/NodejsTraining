/* const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const activity = (options) => {
    console.log(options)
    return (req, res, next) => {
        req.options = options;
        next();
    }
}

app.use(activity({ date: new Date(), foo: 'bar' }));

app.get('/', (req, res) => {
    res.json(req.options);
})

app.listen(3000, () => console.log('server started')); */



let p = 10;
console.log()
let check = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Promise resolved')
    }, 4000);
});
async function asyncFunc() {
    let result = await check;
    console.log(result);
    console.log('hello');
}

asyncFunc();