const db = require("../config/db");

// CREA DISPENSA
exports.createPantry = async (req, res) => {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Il nome della dispensa è obbligatorio" });
    }

    try {
        // Genera un codice casuale di 5 numeri
        const inviteCode = Math.floor(10000 + Math.random() * 90000).toString();

        // Inserisce la nuova dispensa nel db
        const [pantryRes] = await db.query(
            "INSERT INTO pantries (name, created_by, invite_code) VALUES (?, ?, ?)",
            [name, userId, inviteCode]
        );
        const pantryId = pantryRes.insertId;

        // Aggiunge il creatore come owner e con status accettato
        await db.query(
            "INSERT INTO pantry_users (user_id, pantry_id, role, status) VALUES (?, ?, ?, ?)",
            [userId, pantryId, "owner", "accepted"]
        );

        return res.status(201).json({
            message: "Dispensa creata con successo",
            pantryId: pantryId,
            inviteCode: inviteCode
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Errore durante la creazione della dispensa" });
    }
};

// RICHIEDI UNIONE TRAMITE CODICE
exports.joinPantryRequest = async (req, res) => {
    const userId = req.user.id;
    const { invite_code } = req.body;

    // Controlla la presenza del codice d'invito
    if (!invite_code) {
        return res.status(400).json({ message: "Codice di invito obbligatorio" });
    }

    try {
        // Cerca la dispensa associata al codice d'invito
        const [pantry] = await db.query(
            "SELECT id FROM pantries WHERE invite_code = ?",
            [invite_code]
        );

        if (pantry.length === 0) {
            return res.status(404).json({ message: "Dispensa non trovata con questo codice" });
        }

        const pantryId = pantry[0].id;

        // Verifica se l'utente è già membro o ha già una richiesta in sospeso
        const [existing] = await db.query(
            "SELECT * FROM pantry_users WHERE user_id = ? AND pantry_id = ?",
            [userId, pantryId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Fai già parte di questa dispensa o hai una richiesta in attesa" });
        }

        // Inserisce l'utente con status 'pending'
        await db.query(
            "INSERT INTO pantry_users (user_id, pantry_id, role, status) VALUES (?, ?, ?, ?)",
            [userId, pantryId, "member", "pending"]
        );

        return res.status(200).json({ message: "Richiesta inviata. Attendi che il creatore accetti." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Errore durante la richiesta di unione" });
    }
};

// ACCETTA MEMBRO (Solo per l'owner)
exports.acceptMember = async (req, res) => {
    const ownerId = req.user.id;
    const { pantryId, targetUserId } = req.params;

    try {
        // Verifica che chi sta effettuando l'azione sia effettivamente l'owner
        const [ownerCheck] = await db.query(
            "SELECT role FROM pantry_users WHERE user_id = ? AND pantry_id = ? AND role = 'owner'",
            [ownerId, pantryId]
        );

        if (ownerCheck.length === 0) {
            return res.status(403).json({ message: "Solo il creatore può accettare nuovi membri" });
        }

        // Aggiorna lo stato della richiesta dell'utente da 'pending' ad 'accepted'
        const [result] = await db.query(
            "UPDATE pantry_users SET status = 'accepted' WHERE user_id = ? AND pantry_id = ? AND status = 'pending'",
            [targetUserId, pantryId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Nessuna richiesta in attesa trovata per questo utente" });
        }

        return res.status(200).json({ message: "Utente accettato nella dispensa" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Errore durante l'accettazione dell'utente" });
    }
};

// RECUPERA TUTTE LE DISPENSE
exports.getUserPantries = async (req, res) => {
    const userId = req.user.id;

    try {
        const [pantries] = await db.query(
            `SELECT 
            pantries.id,
            pantries.name,
            pantries.invite_code,
            pantries.created_at,
            pantry_users.role,
            pantry_users.status 
            
            FROM pantries
            JOIN pantry_users ON pantries.id = pantry_users.pantry_id
            WHERE pantry_users.user_id = ?`,
            [userId]
        );

        return res.status(200).json(pantries);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Errore nel recupero delle dispense" });
    }
};

// RECUPERA I MEMBRI DI UNA DISPENSA SPECIFICA
exports.getPantryMembers = async (req, res) => {
    const userId = req.user.id;
    const { pantryId } = req.params;

    try {
        // Verifica che chi fa la richiesta faccia parte della dispensa
        const [accessVerify] = await db.query(
            "SELECT * FROM pantry_users WHERE user_id = ? AND pantry_id = ? AND status = 'accepted'",
            [userId, pantryId]
        );

        if (accessVerify.length === 0) {
            return res.status(403).json({ message: "Non hai i permessi per accedere a questa dispensa" });
        }

        const [members] = await db.query(
            `SELECT 
            users.id, 
            users.email, 
            pantry_users.role, 
            pantry_users.status

            FROM users 
            JOIN pantry_users ON users.id = pantry_users.user_id
            WHERE pantry_users.pantry_id = ?`,
            [pantryId]
        );

        return res.status(200).json(members);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Errore nel recupero dei membri della dispensa" });
    }
};

// ABBANDONA O RIMUOVI DALLA DISPENSA
exports.removeOrLeavePantry = async (req, res) => {
    const reqUserId = req.user.id;
    const { pantryId, targetUserId } = req.params;

    // Con targetUserId viene rimosso un membro, altrimenti viene rimosso l'owner
    const userToRemove = targetUserId ? parseInt(targetUserId) : reqUserId;

    try {
        // Verifichiamo che solo l'owner può rimuovere membri
        if (userToRemove !== reqUserId) {
            const [ownerCheck] = await db.query(
                "SELECT role FROM pantry_users WHERE user_id = ? AND pantry_id = ? AND role = 'owner'",
                [reqUserId, pantryId]
            );

            if (ownerCheck.length === 0) {
                return res.status(403).json({ message: "Solo l'owner può rimuovere altri membri" });
            }
        }


        // Verifica il ruolo dell'utente da rimuovere
        const [targetCheck] = await db.query(
            "SELECT role FROM pantry_users WHERE user_id = ? AND pantry_id = ?",
            [userToRemove, pantryId]
        );

        // Se l'owner decide di abbandonare la dispensa, si cancella la dispensa intera
        if (targetCheck.length > 0 && targetCheck[0].role === 'owner' && userToRemove === reqUserId) {
            await db.query("DELETE FROM pantries WHERE id = ?", [pantryId]);
            return res.status(200).json({ message: "Dispensa eliminata poiché il creatore ha abbandonato" });
        }

        // Rimuove l'utente (o se stesso)
        const [result] = await db.query(
            "DELETE FROM pantry_users WHERE user_id = ? AND pantry_id = ?",
            [userToRemove, pantryId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utente non trovato in questa dispensa" });
        }

        return res.status(200).json({
            message: userToRemove === reqUserId ? "Hai abbandonato la dispensa" : "Membro rimosso con successo"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Errore durante la rimozione dalla dispensa" });
    }
}