/* Replace with your SQL commands */

CREATE TYPE ingestion_enum AS ENUM ('IN_PROGRESS','PENDING','COMPLETED','FAILED');


CREATE TABLE IF NOT EXISTS "ingestion" (
          "id"  serial not null primary key ,
          "title" text,
          "status" ingestion_enum,
          "userId" int not null,
          "webhookUrl" text,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "fk_ingestion_user_id" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE
        );

