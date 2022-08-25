const { Utils } = require("../common/utils");
const utils = new Utils();

const authenticateJWT = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
        const userData = utils.verifyJwtToken(token)
        req.session = userData;

        next();
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }

};

module.exports = { authenticateJWT };