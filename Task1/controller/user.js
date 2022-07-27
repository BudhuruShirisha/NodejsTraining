import fetch from "node-fetch";
//getting userdetails from random user
async function getdetails(count) {

    const url = "https://randomuser.me/api/?results="
    try {
        const res = await fetch(url + count); //fetching the url from random user
        const data = await res.json();
        return data; //returning json data
    } catch (err) {
        console.log(err);
    }
}
//exporting get details
export default getdetails