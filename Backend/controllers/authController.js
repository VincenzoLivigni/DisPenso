const db = require("../config/db")
const bcrypt = require("bcryptjs")

exports.register = (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Email e password devono essere inseriti" })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    db.query(
        "INSERT INTO users (email, password) VALUES (?,?)",
        [email, hashedPassword],
        (error, result) => {
            if (error) {
                return res.status(500).json({ message: "Errore durante la connessione al server" })
            }

            res.status(201).json({ message: "Utente Registrato con successo", id: result.insertId })
        }
    )
}