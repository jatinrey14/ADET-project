import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

@Injectable()
export class SuppliersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async findAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM suppliers',
    );
    return rows;
  }

  async findOne(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM suppliers WHERE supplier_id = ?',
      [id],
    );
    if (!rows[0]) throw new NotFoundException(`Supplier with ID ${id} not found`);
    return rows[0];
  }

  async create(supplier_name: string) {
    const [result] = await this.pool().execute<ResultSetHeader>(
      'INSERT INTO suppliers (supplier_name) VALUES (?)',
      [supplier_name],
    );
    return {
      supplier_id: result.insertId,
      supplier_name,
      message: 'Supplier created successfully',
    };
  }

  async update(id: number, supplier_name: string) {
    await this.findOne(id);
    await this.pool().execute(
      'UPDATE suppliers SET supplier_name = ? WHERE supplier_id = ?',
      [supplier_name, id],
    );
    return this.findOne(id);
  }

  async remove(id: number) {
    const [res] = await this.pool().execute<ResultSetHeader>(
      'DELETE FROM suppliers WHERE supplier_id = ?',
      [id],
    );
    if (res.affectedRows === 0) throw new NotFoundException(`Supplier not found`);
    return { message: 'Supplier deleted successfully' };
  }
}