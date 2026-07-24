const express = require("express")
const db = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const productsRoutes = require("./routes/productsRoutes")

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.send("DisPenso backend attivo!")
})

app.use("/api/auth", authRoutes)
app.use("/api", productsRoutes)

db.connect((err) => {
    if (err) {
        console.log("Connessione al database fallita")
        return
    }
    console.log("Connessione al database riuscita");
})

app.listen(3000, () => {
    console.log("Server attivo su porta 3000");
})