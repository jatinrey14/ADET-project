import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createUser(username: string, pass: string) {
    const hashedPassword = await bcrypt.hash(pass, 10);

    // Fixed: calling this.pool() and using hashedPassword variable
    const [result]: any = await this.pool().query(
      'INSERT INTO users (user_name, password) VALUES (?, ?)',
      [username, hashedPassword],
    );

    return {
      userId: result.insertId,
      username,
      message: 'User created successfully',
    };
  }

  async findByUsername(username: string) {
    // Fixed: matching user_name column name
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT user_id, user_name, password FROM users WHERE user_name = ?',
      [username],
    );
    return rows[0] || null;
  }

  async findById(id: number) {
    // Fixed: matching user_id column name
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT user_id, user_name, created_at FROM users WHERE user_id = ?',
      [id],
    );
    return rows[0] || null;
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT user_id, user_name, created_at FROM users',
    );
    return rows;
  }

  async updateUser(id: number, partial: { username?: string; password?: string }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.username) {
      fields.push('user_name = ?');
      values.push(partial.username);
    }
    if (partial.password) {
      const hashed = await bcrypt.hash(partial.password, 10);
      fields.push('password = ?');
      values.push(hashed);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  async deleteUser(id: number) {
    const [res] = await this.pool().execute<ResultSetHeader>(
      'DELETE FROM users WHERE user_id = ?',
      [id],
    );
    return res.affectedRows > 0;
  }
}