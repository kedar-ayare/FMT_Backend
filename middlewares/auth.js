const jwt = require("jsonwebtoken");


async function tokenVerify(req, res, next) {
    attatchedToken = req.headers.token;

    // no token
    if (!attatchedToken) {
        req.auth = { isAuthenticated: false };
        req.log("unauthenticated (no jwt)");
        return next();
    }


    try {
        const decoded = jwt.verify(attatchedToken, process.env.JWT_SECRETE);
        req.User = decoded.id;
        return next();
    } catch (err) {
        res.send("Not a valid token")
    }
}

module.exports = tokenVerify;