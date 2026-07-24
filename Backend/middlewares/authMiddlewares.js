const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: "Il token non esiste" })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "Il token non è valido" })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decodedToken
        next()
    }
    catch (err) {
        return res.status(401).json({ message: "Il token non è valido o è scaduto" })
    }
}

module.exports = authMiddleware