const db = require("../config/db");

// CREO NUOVO PRODOTTO
exports.createPantryItem = async (req, res) => {
    const userId = req.user.id;
    const { pantryId } = req.params;
    const { barcode, expiration_date, quantity } = req.body;

    if (!barcode) {
        return res.status(400).json({ message: "Codice a barre obbligatorio" });
    }

    try {
        // verifica accesso dell'utente alla dispensa
        const [accessVerify] = await db.query(
            "SELECT * FROM pantry_users WHERE pantry_id = ? AND user_id = ?",
            [pantryId, userId]
        )

        if (accessVerify.length === 0) {
            return res.status(403).json({ message: "Non hai i permessi per accedere a questa dispensa" });
        }

        let productId = null;

        // verifica se il prodotto esiste già
        const [existProduct] = await db.query(
            "SELECT id FROM products WHERE barcode = ?",
            [barcode]
        )

        if (existProduct.length > 0) {
            productId = existProduct[0].id
        } else {
            // se il prodotto non esiste ancora lo recupero da Open Food Facts
            const offResponse = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, {
                headers: {
                    'User-Agent': 'DisPensoApp - Web/Mobile - Version 0.1'
                }
            })

            const data = await offResponse.json()

            let name = "Prodotto sconosciuto"
            let brand = null
            let image_url = null
            let category = null
            let ingredients = null
            let nutritions = null

            if (data.status === 1) {
                const offProduct = data.product
                name = offProduct.product_name_it || offProduct.product_name || name
                brand = offProduct.brands || null
                image_url = offProduct.image_front_small_url || offProduct.image_url || null
                category = offProduct.categories || null
                ingredients = offProduct.ingredients_text_it || offProduct.ingredients_text || null

                // aggiungo i valori nutrizionali
                nutritions = offProduct.nutriments || null
            }

            // aggiungo il nuovo prodotto
            const [newProductRes] = await db.query(
                `INSERT INTO products (barcode, name, brand, image_url, category, ingredients) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [barcode, name, brand, image_url, category, ingredients]
            )

            productId = newProductRes.insertId

            // salvo i valori nutrizionali
            if (nutritions) {
                await db.query(
                    `INSERT INTO nutrition (product_id, energy_kcal, fat, saturated_fat, carbohydrates, sugars, fiber, proteins, salt) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        productId,
                        nutritions['energy-kcal_100g'] || nutritions['energy-kcal'] || null,
                        nutritions.fat_100g || null,
                        nutritions['saturated-fat_100g'] || null,
                        nutritions.carbohydrates_100g || null,
                        nutritions.sugars_100g || null,
                        nutritions.fiber_100g || null,
                        nutritions.proteins_100g || null,
                        nutritions.salt_100g || null
                    ]
                )
            }
        }

        // aggiungo l'articolo alla dispensa
        const [itemRes] = await db.query(
            `INSERT INTO pantry_items (pantry_id, product_id, quantity, expiration_date, added_by) 
             VALUES (?, ?, ?, ?, ?)`,
            [pantryId, productId, quantity || 1, expiration_date || null, userId]
        );

        return res.status(201).json({
            message: "Prodotto aggiunto con successo alla dispensa",
            pantryItem: {
                id: itemRes.insertId,
                pantry_id: pantryId,
                product_id: productId,
                quantity: quantity || 1,
                expiration_date: expiration_date || null
            }
        })

    } catch (err) {
        console.error("Errore aggiunta prodotto:", err);
        return res.status(500).json({ message: "Errore durante l'aggiunta del prodotto alla dispensa" });
    }
}

// RECUPERO PRODOTTI
exports.getAllPantryItems = async (req, res) => {
    const userId = req.user.id
    const { pantryId } = req.params

    try {
        // verifica accesso dell'utente alla dispensa
        const [accessVerify] = await db.query(
            "SELECT * FROM pantry_users WHERE pantry_id = ? AND user_id = ?",
            [pantryId, userId]
        )

        if (accessVerify.length === 0) {
            return res.status(403).json({ message: "Non hai i permessi per accedere a questa dispensa" })
        }

        // Query JOIN per recuperare i dettagli del prodotto e l'articolo in dispensa
        const query = `
                SELECT
                    pantryItem.id AS item_id,
                    pantryItem.quantity,
                    pantryItem.expiration_date,
                    pantryItem.created_at AS added_at,
                    product.id AS product_id,
                    product.barcode,
                    product.name,
                    product.brand,
                    product.image_url,
                    product.category
                FROM pantry_items AS pantryItem
                JOIN products AS product ON pantryItem.product_id = product.id
                WHERE pantryItem.pantry_id = ?
                ORDER BY pantryItem.expiration_date IS NULL ASC, pantryItem.expiration_date ASC
        `

        const [items] = await db.query(query, [pantryId])

        return res.status(200).json(items)

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Errore durante il recupero dei prodotti" })
    }
}

//SCADENZE PRODOTTI DISPENSA SPECIFICA
exports.expiringItems = async (req, res) => {
    const { pantryId } = req.params

    const days = parseInt(req.query.days) || 7

    try {

        const [items] = await db.query(`
                SELECT
                    pantryItem.id AS pantry_item_id,
                    pantryItem.quantity,
                    pantryItem.expiration_date,
                    product.barcode,
                    product.name,
                    product.brand,
                    product.image_url,
                    
                DATEDIFF (pantryItem.expiration_date, CURDATE()) AS days_remaining
                FROM pantry_items AS pantryItem
                JOIN products product ON pantryItem.product_id = product.id
                WHERE pantryItem.pantry_id = ?
                AND pantryItem.expiration_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
                ORDER BY pantryItem.expiration_date ASC`,
            [pantryId, days]
        );

        return res.status(200).json({
            count: items.length,
            filter_days: days,
            items: items
        })


    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Errore nel recuperare le scadenze prodotti" })
    }

}

//SCADENZE DI TUTTI I MIEI PRODOTTI
exports.expiringItemsGetAll = async (req, res) => {
    const userId = req.user.id;
    const days = parseInt(req.query.days) || 7;

    try {
        const [items] = await db.query(
            `SELECT
                pantryItem.id AS pantry_item_id,
                pantryItem.quantity,
                pantryItem.expiration_date,
                DATEDIFF(pantryItem.expiration_date, CURDATE()) AS days_remaining,
                product.barcode,
                product.name,
                product.brand,
                product.image_url,
                pantry.id AS pantry_id,
                pantry.name AS pantry_name
            FROM pantry_items AS pantryItem
            JOIN products AS product ON pantryItem.product_id = product.id
            JOIN pantries AS pantry ON pantryItem.pantry_id = pantry.id
            JOIN pantry_users AS pantryUser ON pantry.id = pantryUser.pantry_id
            WHERE pantryUser.user_id = ?
              AND pantryUser.status = 'accepted'
              AND pantryItem.expiration_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
            ORDER BY pantryItem.expiration_date ASC`,
            [userId, days]
        );

        // Mappiamo i dati 
        const formattedItems = items.map(item => ({
            id: item.pantry_item_id.toString(),
            name: item.name,
            brand: item.brand,
            image_url: item.image_url,
            quantity: item.quantity,
            expiration_date: item.expiration_date,
            daysLeft: item.days_remaining,
            pantry: {
                id: item.pantry_id.toString(),
                name: item.pantry_name
            }
        }));

        return res.status(200).json(formattedItems);

    } catch (err) {
        console.error("Errore recupero scadenze globali:", err);
        return res.status(500).json({ message: "Errore nel recuperare le scadenze dei prodotti" });
    }
};

// MODIFICA QUANTITà
exports.reduceQuantityItem = async (req, res) => {
    const { pantryId, itemId } = req.params

    try {
        const [items] = await db.query(
            "SELECT quantity FROM pantry_items WHERE id = ? AND pantry_id = ?",
            [itemId, pantryId]
        )

        // se la quantità è 0
        if (items.length === 0) {
            return res.status(404).json({
                message: "Articolo terminato"
            })
        }

        const currentQuantity = items[0].quantity

        // se la quantità è 1
        if (currentQuantity <= 1) {
            await db.query(
                "DELETE FROM pantry_items WHERE id = ? AND pantry_id = ?",
                [itemId, pantryId]
            )

            return res.status(200).json({
                message: "Articolo consumato ed eliminato dalla dispensa",
                remainingQuantity: 0
            })
        }

        // decrementa la quantità del prodotto di 1
        const newQuantity = currentQuantity - 1

        await db.query(
            "UPDATE pantry_items SET quantity = ? WHERE id = ? AND pantry_id = ?",
            [newQuantity, itemId, pantryId]
        )

        return res.status(200).json({
            message: "Quantità aggiornata con successo",
            remainingQuantity: newQuantity
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Errore nell'aggiornamento della quantità dei prodotti" })
    }
}

//MODIFICA MANUALE SCADENZA E QUANTITA'
exports.updateItem = async (req, res) => {
    const { pantryId, itemId } = req.params
    const { quantity, expiration_date } = req.body

    if (quantity !== undefined && quantity <= 0) {
        return res.status(400).json({ message: 'La quantità deve essere maggiore di 0' })
    }

    try {
        //Verifico che il prodotto esiste
        const [items] = await db.query(
            'SELECT * FROM pantry_items WHERE id = ? AND pantry_id = ?',
            [itemId, pantryId]
        )

        if (items.length === 0) {
            return res.status(404).json({ message: 'Prodotto non trovato' })
        }

        //constante con i vecchi valori
        const newQuantity = quantity !== undefined ? quantity : items[0].quantity
        let newExpirationDate = items[0].expiration_date

        if (expiration_date !== undefined) {
            // Se dal frontend arriva una stringa vuota, forziamo 'null' 
            newExpirationDate = expiration_date === "" ? null : expiration_date;
        }

        await db.query(
            'UPDATE pantry_items SET quantity = ?, expiration_date = ? WHERE id = ? AND pantry_id = ?',
            [newQuantity, newExpirationDate, itemId, pantryId]
        )

        return res.status(200).json({
            message: 'prodotto aggiornato con successo',
            item: {
                id: itemId,
                quantity: newQuantity,
                expiration_date: newExpirationDate
            }
        })

    } catch (err) {
        console.log("Errore db:", err.message);
        return res.status(500).json({ message: "Errore durante la modifica del prodotto" })
    }
}

// ELIMINO PRODOTTO
exports.deletePantryItem = async (req, res) => {
    const userId = req.user.id
    const { pantryId, itemId } = req.params

    try {
        // verifica accesso dell'utente alla dispensa
        const [accessVerify] = await db.query(
            "SELECT * FROM pantry_users WHERE pantry_id = ? AND user_id = ?",
            [pantryId, userId]
        )

        if (accessVerify.length === 0) {
            return res.status(403).json({ message: "Non hai i permessi per questa dispensa" })
        }

        const [result] = await db.query(
            "DELETE FROM pantry_items WHERE id = ? AND pantry_id = ?",
            [itemId, pantryId]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Articolo non trovato nella dispensa" })
        }

        return res.status(200).json({ message: "Articolo eliminato con successo" })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Errore durante l'eliminzione dell'articolo" })
    }
}