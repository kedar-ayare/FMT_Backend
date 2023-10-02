const jwt = require("jsonwebtoken");
const decrypt = require("../utilities.js/decrpyt")

async function tokenVerify(req, res, next) {
    console.log(req.headers)
    try {
        const attatchedToken = await decrypt(req.headers.token);
        console.log("token after decrypt: ", attatchedToken)
        // no token
        if (!attatchedToken) {
            req.auth = { isAuthenticated: false };
            console.log("unauthenticated (no jwt)");
            res.json({ err: "ValErr-01" })
        }


        try {
            const decoded = jwt.verify(attatchedToken, process.env.JWT_SECRETE);
            req.User = decoded.id;
            return next();
        } catch (err) {
            console.log(err)
            res.json({ err: "ValErr-02" })
        }
    } catch (err) {
        res.json({ err: err })
    }

}



module.exports = tokenVerify;