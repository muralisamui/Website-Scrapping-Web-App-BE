import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class New1721063666857 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "company_details" (
                "id" SERIAL PRIMARY KEY,
                "url" VARCHAR(4000) UNIQUE NOT NULL,
                "name" VARCHAR,
                "description" VARCHAR(5000),
                "logo" VARCHAR(2000),
                "facebook" VARCHAR(2000),
                "linkedin" VARCHAR(2000),
                "twitter" VARCHAR(2000),
                "instagram" VARCHAR(2000),
                "address" VARCHAR(2000),
                "phone" VARCHAR(200),
                "email" VARCHAR(500),
                "screenshot" BYTEA
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "company_details"
        `);
    }

}
