import datechange from "date-and-time";
//object destructuring
export function parsingDataJson(Object) {
    const {
        gender,
        name: {
            title,
            first,
            last
        },
        email,
        phone,
        dob: {
            date,
            age
        },
        location: {
            street: {
                number,
                name
            },
            city,
            state,
            postcode
        }
    } = Object
    const fullname = first + ' ' + last;
    const dob = datechange.format((new Date(date)), 'YYYY-MM-DD');
    const address = {
        line1: number,
        line2: name,
        city,
        state,
        zip: postcode
    }
    const responseData = {
        gender,
        email,
        fullname,
        phone,
        title,
        dob,
        age,
        address
    }
    return responseData;
}