import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminMar11202520281741699708224 implements MigrationInterface {
    name = 'AddAdminMar11202520281741699708224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(100) NOT NULL, "password" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4ba6d0c734d53f8e1b2e24b6c56" UNIQUE ("username"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "admins"`);
    }

}
