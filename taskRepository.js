import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const taskRepository = {
  async getAll() {
    const res = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    return res.rows;
  },
  
  async getById(id) {
    const res = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return res.rows[0];
  },
  
  async create(title) {
    const res = await pool.query(
      'INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING *',
      [title, false]
    );
    return res.rows[0];
  },
  
  async update(id, title, done) {
    const res = await pool.query(
      'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *',
      [title, done, id]
    );
    return res.rows[0];
  },
  
  async delete(id) {
    const res = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return res.rowCount > 0;
  }
};
