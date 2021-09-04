import {MigrationInterface, QueryRunner} from "typeorm";

export class fixRoomRelation1630673616496 implements MigrationInterface {
    name = 'fixRoomRelation1630673616496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."invites" DROP CONSTRAINT "FK_5788d39432bba99bd0a27a9265a"`);
        await queryRunner.query(`ALTER TABLE "public"."invites" ADD CONSTRAINT "FK_5788d39432bba99bd0a27a9265a" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."invites" DROP CONSTRAINT "FK_5788d39432bba99bd0a27a9265a"`);
        await queryRunner.query(`ALTER TABLE "public"."invites" ADD CONSTRAINT "FK_5788d39432bba99bd0a27a9265a" FOREIGN KEY ("roomId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
