const JWT = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try{
    let token = req.headers['authorization'];
    console.log(token);
    const decoded = JWT.verify(token, process.env.APP_SECRET);
    req.userData = decoded;
    next();
} catch(err) {
    console.log(err)
    return res.status(401).json({
        "message": "Not Authorized",
    })
}

}