import {MigrationInterface, QueryRunner} from "typeorm";

export class infoInvite1635259028883 implements MigrationInterface {
    name = 'infoInvite1635259028883'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."invites" ADD "info" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."invites" DROP COLUMN "info"`);
    }

}
