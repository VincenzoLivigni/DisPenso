const db = require("../config/db")

exports.create = async (req, res) => {
    const userId = req.user.id;
    const { barcode } = req.body;

    if (!barcode) {
        return res.status(400).json({ message: "Codice a barre obbligatorio" });
    }

    try {
        const offResponse = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, {
            headers: {
                'User-Agent': 'DisPensoApp - Web/Mobile - Version 0.1'
            }
        });

        const data = await offResponse.json();

        let name = "Prodotto sconosciuto";
        let brand = null;
        let image_url = null;
        let category = null;
        let ingredients = null;
        let source = "open_food_facts";

        if (data.status === 1) {
            const offProduct = data.product;
            name = offProduct.product_name_it || offProduct.product_name || name;
            brand = offProduct.brands || null;
            image_url = offProduct.image_front_small_url || offProduct.image_url || null;
            category = offProduct.categories || null;
            ingredients = offProduct.ingredients_text_it || offProduct.ingredients_text || null;
        }

        const query = `
            INSERT INTO products 
            (user_id, barcode, name, brand, image_url, category, ingredients, source)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            query,
            [
                userId,
                barcode,
                name,
                brand,
                image_url,
                category,
                ingredients,
                source
            ],
            (error, result) => {
                if (error) {
                    console.error("Errore salvataggio prodotto nel DB:", error);
                    return res.status(500).json({ message: "Errore durante il salvataggio nel database", error: error.message });
                }

                res.status(201).json({
                    message: "Prodotto aggiunto con successo alla dispensa",
                    product: {
                        id: result.insertId,
                        barcode,
                        name,
                        brand,
                        image_url,
                        category,
                        ingredients,
                        source
                    }
                });
            }
        );

    } catch (error) {
        console.error("Errore comunicazione Open Food Facts:", error);
        return res.status(500).json({ message: "Errore durante il recupero dei dati da Open Food Facts" });
    }
};

exports.getAll = (req, res) => {
    const userId = req.user.id;
    const query = "SELECT * FROM products WHERE user_id = ? ORDER BY id DESC";

    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error("Errore recupero prodotti:", error);
            return res.status(500).json({ message: "Errore durante il recupero dei prodotti" });
        }

        res.status(200).json(results);
    });
};

exports.delete = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const query = "DELETE FROM products WHERE id = ? AND user_id = ?";

    db.query(query, [id, userId], (error, result) => {
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