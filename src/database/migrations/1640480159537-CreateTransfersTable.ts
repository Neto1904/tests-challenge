import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateTransfersTable1640480159537 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'statements',
            columns: [
              {
                name: 'id',
                type: 'uuid',
                isPrimary: true,
              },
              {
                name: 'sender_id',
                type: 'uuid',
              },
              {
                name: 'receiver_id',
                type: 'uuid',
              },
              {
                name: 'description',
                type: 'varchar',
              },
              {
                name: 'amount',
                type: 'decimal',
                precision: 5,
                scale: 2,
              },
              {
                name: 'created_at',
                type: 'timestamp',
                default: 'now()'
              },
              {
                name: 'updated_at',
                type: 'timestamp',
                default: 'now()'
              }
            ],
            foreignKeys: [
              {
                name: 'statements',
                columnNames: ['sender_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
              },
              {
                name: 'statements',
                columnNames: ['receiver_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
              }
            ]
          }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
