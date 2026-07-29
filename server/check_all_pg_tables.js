const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

const pgUrl = process.env.DATABASE_URL || "postgresql://wilmer@localhost:5432/motoxcult?schema=public";

async function checkAll() {
  const client = new Client({ connectionString: pgUrl });
  try {
    await client.connect();
    console.log("--- BASE DE DATOS LOCAL POSTGRESQL ---");
    const users = await client.query('SELECT * FROM "User"');
    console.log("Usuarios encontrdos en PostgreSQL local:");
    console.dir(users.rows, { depth: null });

    const bikes = await client.query('SELECT * FROM "Bike"');
    console.log("Motos encontradas en PostgreSQL local:");
    console.dir(bikes.rows, { depth: null });
  } catch (err) {
    console.error("Error en PostgreSQL local:", err.message);
  } finally {
    await client.end();
  }
}

checkAll();
