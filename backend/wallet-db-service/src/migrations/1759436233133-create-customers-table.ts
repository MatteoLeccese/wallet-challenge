import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCustomersTable1759436233133 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'customers',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'document', type: 'varchar', length: '50', isUnique: true },
          { name: 'names', type: 'varchar', length: '150' },
          { name: 'email', type: 'varchar', length: '150', isUnique: true },
          { name: 'phone', type: 'varchar', length: '30', isUnique: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
        ],
        indices: [
          {
            name: 'IDX_customers_document',
            columnNames: ['document'],
            isUnique: true,
          },
          {
            name: 'IDX_customers_email',
            columnNames: ['email'],
            isUnique: true,
          },
          {
            name: 'IDX_customers_phone',
            columnNames: ['phone'],
            isUnique: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('customers');
  }
}
