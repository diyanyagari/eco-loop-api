import { MigrationInterface, QueryRunner } from "typeorm";

export class ReInitMar11202520151741698949346 implements MigrationInterface {
    name = 'ReInitMar11202520151741698949346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "families" ("kk_number" character varying(16) NOT NULL, "family_name" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8e44970c6215d282c6c96350f23" PRIMARY KEY ("kk_number"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nik" character varying(16) NOT NULL, "name" character varying(100) NOT NULL, "phone" character varying(15), "email" character varying(100), "password" text NOT NULL, "latest_login" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "familyKkNumber" character varying(16), CONSTRAINT "UQ_e57d66dc56e6d164b6467776bb7" UNIQUE ("nik"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "weight" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "locationId" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bank_locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "qr_code" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_91721c75cb6429c1470f6fc84d8" UNIQUE ("name"), CONSTRAINT "UQ_afab4eb8f68cbf010eb9a4361f2" UNIQUE ("qr_code"), CONSTRAINT "PK_74d83f293e4b5a33817e4e84d5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_949db7114f0177eedef7fd61af5" FOREIGN KEY ("familyKkNumber") REFERENCES "families"("kk_number") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6c36fc1c11ef88463d3b63e33de" FOREIGN KEY ("locationId") REFERENCES "bank_locations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6c36fc1c11ef88463d3b63e33de"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_949db7114f0177eedef7fd61af5"`);
        await queryRunner.query(`DROP TABLE "bank_locations"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "families"`);
    }

}
