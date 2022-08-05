const Schema = require('validate')
const officeSchema = new Schema({

    rectype: {
        type: String,

    },
    code: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['backoffice', 'clinic', 'custom', 'lab', 'office', 'carecenter'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true
    },

    inactivereason: {
        type: String,
        required: true
    },

    created: {
        type: Date,
        default: Date.now,

    },
    data: {

    }
});


function Validationcheck(req, res, next) {
    const {
        body: {
            rectype,
            code,
            type,
            status,
            inactivereason,
            created,
            date
        }
    } = req;


    const responsedata = {
        rectype,
        code,
        type,
        status,
        inactivereason,
        created,
        date
    };

    const error = officeSchema.validate(responsedata);
    console.log(error);
    if (error == null || error.length === 0) {
        //   console.log(responsedata);
        next();
    } else {
        console.log("error");
        res.send("error");
    }
}

module.exports = { Validationcheck, officeSchema };