import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePaymentSessionsTable1759436518127
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payment_sessions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'token', type: 'char', length: '6' },
          { name: 'confirmed', type: 'boolean', default: false },
          { name: 'amount', type: 'decimal', precision: 15, scale: 2 },
          { name: 'walletId', type: 'int', isNullable: true },
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
          { name: 'IDX_payment_sessions_token', columnNames: ['token'] },
          { name: 'IDX_payment_sessions_walletId', columnNames: ['walletId'] },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'payment_sessions',
      new TableForeignKey({
        name: 'FK_payment_sessions_wallet',
        columnNames: ['walletId'],
        referencedTableName: 'wallets',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'payment_sessions',
      'FK_payment_sessions_wallet',
    );
    await queryRunner.dropTable('payment_sessions');
  }
}
