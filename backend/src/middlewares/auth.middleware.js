const {verifyToken} = require("../config/jwt")
function authMiddleware(req, res, next){
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({message: "Unauthorized"})
    }
    try{
        const decoded = verifyToken(token)
        req.user = decoded
        next()
    } catch (err) {
        if(err.name === "TokenExpiredError"){
            return res.status(401).json({message: "Token expired"})
        }
        return res.status(401).json({message: "Unauthorized"})
    }
}
module.exports = authMiddleware