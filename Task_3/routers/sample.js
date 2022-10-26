const express = require('express')
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

app.listen(3000, () => console.log('server started'));