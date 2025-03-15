import { MigrationInterface, QueryRunner } from "typeorm";

export class EditEntityBankMar11202522201741706426595 implements MigrationInterface {
    name = 'EditEntityBankMar11202522201741706426595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_locations" ADD "address" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_locations" DROP COLUMN "address"`);
    }

}
