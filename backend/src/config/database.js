import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    console.log('\u2713 Database connected');
    client.release();

    const tables = [
      `CREATE TABLE IF NOT EXISTS shows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        language VARCHAR(50),
        genre VARCHAR(100),
        duration INTEGER,
        rating DECIMAL(3,1),
        poster_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS show_slots (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        show_id UUID NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        total_seats INTEGER NOT NULL,
        available_seats INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        screen_name VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(show_id, start_time)
      )`,

      `CREATE TABLE IF NOT EXISTS seats (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slot_id UUID NOT NULL REFERENCES show_slots(id) ON DELETE CASCADE,
        seat_number VARCHAR(10) NOT NULL,
        status VARCHAR(20) DEFAULT 'AVAILABLE',
        booked_by UUID,
        booked_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(slot_id, seat_number)
      )`,

      `CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        slot_id UUID NOT NULL REFERENCES show_slots(id),
        show_id UUID NOT NULL REFERENCES shows(id),
        num_seats INTEGER NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'PENDING',
        payment_status VARCHAR(20) DEFAULT 'PENDING',
        seats_booked TEXT[] NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        confirmed_at TIMESTAMP,
        CONSTRAINT unique_user_slot UNIQUE(user_id, slot_id)
      )`,

      `CREATE INDEX IF NOT EXISTS idx_bookings_expires ON bookings(expires_at) WHERE status = 'PENDING'`,
      `CREATE INDEX IF NOT EXISTS idx_seats_slot ON seats(slot_id)`,
      `CREATE INDEX IF NOT EXISTS idx_slots_show ON show_slots(show_id)`
    ];

    for (const table of tables) {
      await pool.query(table);
    }
    console.log('\u2713 Tables initialized');
  } catch (error) {
    console.error('Database error:', error);
    process.exit(1);
  }
}

export async function query(text, params) {
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}
