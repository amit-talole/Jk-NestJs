/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS "user_tokens" (
   		  id serial not null primary key,
          "refreshToken" text,
          "userId" int NOT NULL unique,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "user_token_user_id" FOREIGN KEY ("userId") REFERENCES "user" (id) ON DELETE CASCADE
        );
