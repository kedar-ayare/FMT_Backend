const jwt = require("jsonwebtoken");


async function tokenVerify(req, res, next) {
    attatchedToken = req.headers.token;

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
        res.json({ err: "ValErr-02" })
    }
}



module.exports = tokenVerify;