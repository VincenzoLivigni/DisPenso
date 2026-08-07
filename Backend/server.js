const express = require("express")
const cors = require("cors");
const authRoutes = require("./routes/authRoutes")
const pantryItemsRoutes = require("./routes/pantryItemsRoutes")
const pantryRoutes = require("./routes/pantryRoutes");

const app = express()

app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
    res.send("DisPenso backend attivo!")
})

app.use("/api/auth", authRoutes);
app.use("/api/pantry", pantryRoutes);
app.use("/api/pantry-items", pantryItemsRoutes);

app.listen(3000, '0.0.0.0', () => {
    console.log(`Server attivo su http://localhost:3000`);
});