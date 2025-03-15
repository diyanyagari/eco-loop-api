import { MigrationInterface, QueryRunner } from "typeorm";

export class EditEntityAddTokenColumnMar11202522581741708685433 implements MigrationInterface {
    name = 'EditEntityAddTokenColumnMar11202522581741708685433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "current_token" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "admins" ADD "current_token" character varying(500)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" DROP COLUMN "current_token"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "current_token"`);
    }

}
