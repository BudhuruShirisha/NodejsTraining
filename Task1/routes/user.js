import express from "express"
var router = express.Router();
import order from "lodash";
import { parsingDataJson } from "../helper/UserDataHelpers.js";
import getdetails from "../controller/user.js"
// GET users listing 
router.get('/list', async(req, res) => {

    const count = req.query.count || 10;

    if (count <= 50) {
        const users = await getdetails(count)
        const data = users.results;
        const userList = []; //getting the userdetails in userlist
        data.forEach(userObj => {
            userList.push(parsingDataJson(userObj)); //userobject is passed to function
        });
        //sort by name in asc  and age in desc
        order.orderBy(userList, ['fullname', 'age'], ['asc', 'desc']);
        res.json(userList);
    } else
    //error if count is more than 50
        res.status(400).json({ status: 'Error', message: 'users must be less than 50' });
});

export default router;