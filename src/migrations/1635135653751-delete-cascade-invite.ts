import {MigrationInterface, QueryRunner} from "typeorm";

export class deleteCascadeInvite1635135653751 implements MigrationInterface {
    name = 'deleteCascadeInvite1635135653751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."invites" DROP CONSTRAINT "FK_5788d39432bba99bd0a27a9265a"`);
        await queryRunner.query(`ALTER TABLE "public"."invites" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."invites_status_enum"`);
        await queryRunner.query(`ALTER TABLE "public"."invites" ADD CONSTRAINT "FK_5788d39432bba99bd0a27a9265a" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."invites" DROP CONSTRAINT "FK_5788d39432bba99bd0a27a9265a"`);
        await queryRunner.query(`CREATE TYPE "public"."invites_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "public"."invites" ADD "status" "public"."invites_status_enum" NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE "public"."invites" ADD CONSTRAINT "FK_5788d39432bba99bd0a27a9265a" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
