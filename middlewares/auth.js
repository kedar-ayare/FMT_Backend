const jwt = require("jsonwebtoken");
const decrypt = require("../utilities.js/decrpyt")

async function tokenVerify(req, res, next) {
    // console.log(req.headers)
    if (req.headers.token === undefined) {
        req.auth = { isAuthenticated: false }
        res.json({ err: "ValError-01" })
    } else {
        try {
            const attatchedToken = await decrypt(req.headers.token);

            try {
                const decoded = jwt.verify(attatchedToken, process.env.JWT_SECRETE);
                req.User = decoded.id;
                return next();
            } catch (err) {
                console.log(err)
                res.json({ err: "ValError-03" })
            }
        } catch (err) {
            console.log(err)
            res.json({err:"ValError-02"})
        }
    }


}



module.exports = tokenVerify;