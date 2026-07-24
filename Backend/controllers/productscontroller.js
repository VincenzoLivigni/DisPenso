const db = require("../config/db")

exports.create = async (req, res) => {
    const { barcode, user_id } = req.body;

    if (!barcode) {
        return res.status(400).json({ message: "Codice a barre obbligatorio" });
    }

    try {
        // Chiamata all'API di Open Food Facts
        const offResponse = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, {
            headers: {
                'User-Agent': 'DisPensoApp - Web/Mobile - Version 0.1'
            }
        });

        const data = await offResponse.json();

        let name = "Prodotto sconosciuto";
        let brand = null;
        let image_url = null;

        // Se Open Food Facts trova il prodotto, estraiamo i dati principali
        if (data.status === 1) {
            const offProduct = data.product;
            name = offProduct.product_name_it || offProduct.product_name || name;
            brand = offProduct.brands || null;
            image_url = offProduct.image_front_small_url || offProduct.image_url || null;
        }

        // Salvataggio nel DB MySQL
        const query = `INSERT INTO products (barcode, name, brand, image_url, user_id) VALUES (?, ?, ?, ?, ?)`;

        db.query(
            query,
            [
                barcode,
                name,
                brand,
                image_url,
                user_id || null
            ],
            (error, result) => {
                if (error) {
                    console.error("Errore salvataggio prodotto nel DB:", error);
                    return res.status(500).json({ message: "Errore durante il salvataggio nel database" });
                }

                res.status(201).json({
                    message: "Prodotto aggiunto con successo alla dispensa",
                    product: {
                        id: result.insertId,
                        barcode,
                        name,
                        brand,
                        image_url,
                    }
                });
            }
        );

    } catch (error) {
        console.error("Errore comunicazione Open Food Facts:", error);
        return res.status(500).json({ message: "Errore durante il recupero dei dati da Open Food Facts" });
    }
};

// 2. GET ALL: Mostra tutti i prodotti presente nel DB MySQL
exports.getAll = (req, res) => {
    const query = "SELECT * FROM products ORDER BY id DESC";

    db.query(query, (error, results) => {
        if (error) {
            console.error("Errore recupero prodotti:", error);
            return res.status(500).json({ message: "Errore durante il recupero dei prodotti" });
        }

        res.status(200).json(results);
    });
};

// 3. DELETE: Rimuove un prodotto tramite il suo ID nel DB
exports.delete = (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM products WHERE id = ?";

    db.query(query, [id], (error, result) => {
        if (error) {
            console.error("Errore eliminazione prodotto:", error);
            return res.status(500).json({ message: "Errore durante l'eliminazione del prodotto" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Prodotto non trovato" });
        }

        res.status(200).json({ message: "Prodotto eliminato con successo" });
    });
};