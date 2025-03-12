const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

const initializeAdmin = async () => {
    try {
        // Leggi il database esistente o crea uno nuovo
        let db = { users: [], prenotazioni: [] };
        if (fs.existsSync(dbPath)) {
            db = JSON.parse(fs.readFileSync(dbPath));
        }

        // Verifica se l'admin esiste già
        const adminExists = db.users.some(user => user.email === 'admin@prenotazioni.com');

        if (!adminExists) {
            // Crea l'admin
            const hashedPassword = await bcrypt.hash('admin', 10);
            const admin = {
                id: '1',
                nome: 'Amministratore',
                email: 'admin@prenotazioni.com',
                password: hashedPassword,
                role: 'admin',
                createdAt: new Date().toISOString()
            };

            db.users.push(admin);
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            console.log('Utente admin creato con successo!');
        } else {
            console.log('L\'utente admin esiste già');
        }
    } catch (error) {
        console.error('Errore durante la creazione dell\'admin:', error);
    }
};

initializeAdmin();

//Necessaria per tenere vivo l'account admin , ad ogni spegnimento del server viene rigenerato