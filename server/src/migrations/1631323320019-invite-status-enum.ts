import {MigrationInterface, QueryRunner} from "typeorm";

export class inviteStatusEnum1631323320019 implements MigrationInterface {
    name = 'inviteStatusEnum1631323320019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."invites_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "public"."invites" ADD "status" "public"."invites_status_enum" NOT NULL DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."invites" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."invites_status_enum"`);
    }

}
