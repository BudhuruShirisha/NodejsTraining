const { createRecord } = require('../src/db/mongodb');
patientdata = [{

        "rectype": "Patient",
        "firstname": "budhuru",
        "lastname": "reddy",
        "nickname": "honey",
        "gender": "female",
        "dob": "26/9/1995",
        "mrn": "eddddde",
        "ssn": "2344432",
        "language": "telugu",
        "status": "inactive",
        "inactivereason": "nan",
        "dateinactivate": "cdxwd",
        "data": "frefe",
        "id": "5",
        "created": "2022-08-04T01:54:29.868Z"
    },
    {

        "rectype": "Patient",
        "firstname": "budhuru",
        "lastname": "reddy",
        "nickname": "honey",
        "gender": "female",
        "dob": "26/9/1996",
        "mrn": "eddddde",
        "ssn": "2344432",
        "language": "telugu",
        "status": "inactive",
        "inactivereason": "nan",
        "dateinactivate": "cdxwd",
        "data": "frefe",

        "created": "2022-08-04T01:54:29.868Z"
    }

]
const organization = [{
        "rectype": "organization",
        "code": "CH",
        "name": "sri sai",
        "type": "clinic",
        "status": "inactive",
        "inactivereason": "no growth",
        "data": "not required",
        "created": "2022-08-04T01:54:29.868Z"
    },
    {
        "rectype": "organization",
        "code": "ALP",
        "name": "gv diagnostic centre",
        "type": "lab",
        "status": "active",
        "inactivereason": "Nan",
        "data": "not required",
        "created": "2022-08-04T01:54:29.868Z"
    }
]

async function addpat() {
    for (i = 0; i < patientdata.length; i++)
        await addRecord(patientdata[i])
}

async function addorg() {
    for (i = 0; i < organization.length; i++)
        await createRecord(organization[i])
}
addpat();
addorg();