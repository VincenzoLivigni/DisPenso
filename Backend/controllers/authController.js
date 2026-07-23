const db = require("../config/db")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.register = (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Email e password non inserite" })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    db.query(
        "INSERT INTO users (email, password) VALUES (?,?)",
        [email, hashedPassword],
        (error, result) => {
            if (error) {
                return res.status(500).json({ message: "Errore durante la registrazione" })
            }

            res.status(201).json({ message: "Utente registrato con successo", id: result.insertId })
        }
    )
}


exports.login = (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Email e password non inserite" })
    }

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (error, result) => {
            if (error) {
                return res.status(500).json({ message: "Errore durante il login" })
            }

            if (result.length === 0) {
                return res.status(401).json({ message: "Email inesistente" })
            }

            const user = result[0]

            const matchedPassword = bcrypt.compareSync(password, user.password)
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

            res.status(200).json({ message: "Login effettuato con successo", token })
        }
    )
}