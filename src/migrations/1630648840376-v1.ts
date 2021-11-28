import {MigrationInterface, QueryRunner} from "typeorm";

export class v11630648840376 implements MigrationInterface {
    name = 'v11630648840376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "fullName" character varying NOT NULL, "username" character varying NOT NULL, "private" boolean NOT NULL DEFAULT false, "password" text NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "text" text NOT NULL, "senderId" integer NOT NULL, "roomId" integer NOT NULL, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "members_role_enum" AS ENUM('ADMIN', 'MEMBER', 'INVITED')`);
        await queryRunner.query(`CREATE TABLE "members" ("role" "members_role_enum" NOT NULL DEFAULT 'MEMBER', "userId" integer NOT NULL, "roomId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2d6a5928a6ad910d389ed91ea4b" PRIMARY KEY ("userId", "roomId"))`);
        await queryRunner.query(`CREATE TYPE "rooms_type_enum" AS ENUM('DM', 'GROUP')`);
        await queryRunner.query(`CREATE TABLE "rooms" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying, "type" "rooms_type_enum" NOT NULL DEFAULT 'DM', CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invites" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "inviteeId" integer NOT NULL, "inviterId" integer NOT NULL, "roomId" integer NOT NULL, CONSTRAINT "PK_aa52e96b44a714372f4dd31a0af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "notifications_type_enum" AS ENUM('REQUEST_DM', 'REQUEST_GROUP', 'ACCEPT_DM', 'ACCEPT_GROUP')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" "notifications_type_enum" NOT NULL, "text" text NOT NULL, "recieverId" integer NOT NULL, "read" boolean NOT NULL DEFAULT false, "redirectId" integer NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_aaa8a6effc7bd20a1172d3a3bc8" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "members" ADD CONSTRAINT "FK_5172792a336dffdda391f582f7c" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "members" ADD CONSTRAINT "FK_839756572a2c38eb5a3b563126e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invites" ADD CONSTRAINT "FK_5788d39432bba99bd0a27a9265a" FOREIGN KEY ("roomId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invites" ADD CONSTRAINT "FK_104777f347b013994999516fa95" FOREIGN KEY ("inviteeId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invites" ADD CONSTRAINT "FK_fba2934931761bc4c620e1b180f" FOREIGN KEY ("inviterId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_93b2f7fd11bdb8389a78d7450cf" FOREIGN KEY ("recieverId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_93b2f7fd11bdb8389a78d7450cf"`);
        await queryRunner.query(`ALTER TABLE "invites" DROP CONSTRAINT "FK_fba2934931761bc4c620e1b180f"`);
        await queryRunner.query(`ALTER TABLE "invites" DROP CONSTRAINT "FK_104777f347b013994999516fa95"`);
        await queryRunner.query(`ALTER TABLE "invites" DROP CONSTRAINT "FK_5788d39432bba99bd0a27a9265a"`);
        await queryRunner.query(`ALTER TABLE "members" DROP CONSTRAINT "FK_839756572a2c38eb5a3b563126e"`);
        await queryRunner.query(`ALTER TABLE "members" DROP CONSTRAINT "FK_5172792a336dffdda391f582f7c"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_aaa8a6effc7bd20a1172d3a3bc8"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "notifications_type_enum"`);
        await queryRunner.query(`DROP TABLE "invites"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
        await queryRunner.query(`DROP TYPE "rooms_type_enum"`);
        await queryRunner.query(`DROP TABLE "members"`);
        await queryRunner.query(`DROP TYPE "members_role_enum"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
