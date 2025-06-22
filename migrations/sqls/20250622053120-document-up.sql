CREATE TABLE IF NOT EXISTS "documents" (
          "id"  serial not null primary key ,
          "name" text,
          "userId" int not null,
          "link" text,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "fk_user_id" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE
        );

        alter table "documents" add column if not exists "type" text;

        alter table "documents" add column if not exists "originalName" text;

