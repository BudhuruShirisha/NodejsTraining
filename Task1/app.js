import express from "express";
import userRouter from "./routes/user.js"
const app = express();
//middleware to use express json for parsing the data
app.use(express.json());

app.listen(3000, () => console.log('Node server is running on http://localhost:3000'));

app.use('/user', userRouter);