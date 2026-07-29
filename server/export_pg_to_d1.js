const dotenv = require('dotenv');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

dotenv.config();

const pgUrl = process.env.DATABASE_URL || "postgresql://wilmer@localhost:5432/motoxcult?schema=public";

async function exportData() {
  const client = new Client({ connectionString: pgUrl });
  
  try {
    await client.connect();
    console.log("Conectado a la base de datos PostgreSQL local...");

    let sqlStatements = [];

    // 1. Users
    const users = await client.query('SELECT * FROM "User"');
    console.log(`Encontrados ${users.rows.length} usuarios.`);
    for (const u of users.rows) {
      const email = u.email ? `'${u.email.replace(/'/g, "''")}'` : 'NULL';
      const password = u.password ? `'${u.password.replace(/'/g, "''")}'` : 'NULL';
      const name = u.name ? `'${u.name.replace(/'/g, "''")}'` : 'NULL';
      const nickname = u.nickname ? `'${u.nickname.replace(/'/g, "''")}'` : 'NULL';
      const bio = u.bio ? `'${u.bio.replace(/'/g, "''")}'` : 'NULL';
      const location = u.location ? `'${u.location.replace(/'/g, "''")}'` : 'NULL';
      const birthDate = u.birthDate ? `'${u.birthDate.toISOString()}'` : 'NULL';
      const country = u.country ? `'${u.country.replace(/'/g, "''")}'` : 'NULL';
      const city = u.city ? `'${u.city.replace(/'/g, "''")}'` : 'NULL';
      const phone = u.phone ? `'${u.phone.replace(/'/g, "''")}'` : 'NULL';
      const club = u.club ? `'${u.club.replace(/'/g, "''")}'` : 'NULL';
      const avatar = u.avatar ? `'${u.avatar.replace(/'/g, "''")}'` : 'NULL';
      const karma = u.karma !== undefined ? u.karma : 0;
      const role = u.role ? `'${u.role}'` : "'USER'";
      const resetToken = u.resetToken ? `'${u.resetToken}'` : 'NULL';
      const resetTokenExpiry = u.resetTokenExpiry ? `'${u.resetTokenExpiry.toISOString()}'` : 'NULL';

      sqlStatements.push(`INSERT OR REPLACE INTO "User" (id, email, password, name, nickname, bio, location, birthDate, country, city, phone, club, avatar, karma, role, resetToken, resetTokenExpiry) VALUES (${u.id}, ${email}, ${password}, ${name}, ${nickname}, ${bio}, ${location}, ${birthDate}, ${country}, ${city}, ${phone}, ${club}, ${avatar}, ${karma}, ${role}, ${resetToken}, ${resetTokenExpiry});`);
    }

    // 2. Bikes
    const bikes = await client.query('SELECT * FROM "Bike"');
    console.log(`Encontradas ${bikes.rows.length} motos.`);
    for (const b of bikes.rows) {
      const brand = `'${b.brand.replace(/'/g, "''")}'`;
      const model = `'${b.model.replace(/'/g, "''")}'`;
      const nickname = b.nickname ? `'${b.nickname.replace(/'/g, "''")}'` : 'NULL';
      const photo = b.photo ? `'${b.photo.replace(/'/g, "''")}'` : 'NULL';

      sqlStatements.push(`INSERT OR REPLACE INTO "Bike" (id, brand, model, year, nickname, photo, userId) VALUES (${b.id}, ${brand}, ${model}, ${b.year}, ${nickname}, ${photo}, ${b.userId});`);
    }

    // 3. Events
    const events = await client.query('SELECT * FROM "Event"');
    console.log(`Encontrados ${events.rows.length} eventos.`);
    for (const e of events.rows) {
      const title = `'${e.title.replace(/'/g, "''")}'`;
      const date = `'${e.date.toISOString()}'`;
      const type = `'${e.type.replace(/'/g, "''")}'`;
      const difficulty = `'${e.difficulty.replace(/'/g, "''")}'`;

      sqlStatements.push(`INSERT OR REPLACE INTO "Event" (id, title, date, type, difficulty, distance, isOfficial, isExclusive, organizerId) VALUES (${e.id}, ${title}, ${date}, ${type}, ${difficulty}, ${e.distance}, ${e.isOfficial ? 1 : 0}, ${e.isExclusive ? 1 : 0}, ${e.organizerId});`);
    }

    // Write file
    const sqlPath = path.join(__dirname, 'prisma', 'seed_d1.sql');
    fs.writeFileSync(sqlPath, sqlStatements.join('\n'));
    console.log(`Archivo SQL generado en ${sqlPath} con ${sqlStatements.length} sentencias.`);

  } catch (err) {
    console.error("Error leyendo PostgreSQL local:", err.message);
  } finally {
    await client.end();
  }
}

exportData();
