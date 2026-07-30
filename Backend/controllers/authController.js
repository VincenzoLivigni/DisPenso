const db = require("../config/db")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Email e password non inserite" })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const [userRes] = await db.query(
            "INSERT INTO users (email, password) VALUES (?,?)",
            [email, hashedPassword]
        )
        const userId = userRes.insertId

        return res.status(201).json({
            message: "Utente registrato con successo. Crea o unisciti a una dispensa per iniziare.",
            userId: userId
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Errore durante la registrazione" })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Email e password non inserite" })
    }

    try {
        const [result] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        )

        if (result.length === 0) {
            return res.status(401).json({ message: "Email inesistente" })
        }

        const user = result[0]

        const matchedPassword = await bcrypt.compare(password, user.password)
        if (!matchedPassword) {
            return res.status(401).json({ message: "Email o password non valide" })
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email
        },
            process.env.JWT_SECRET,
            { expiresIn: "9h" }
        )

        return res.status(200).json({ message: "Login effettuato con successo", token })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Errore durante il login" })
    }
}