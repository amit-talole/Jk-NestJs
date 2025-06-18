/* Replace with your SQL commands */

CREATE TYPE user_role_enum AS ENUM ('(admin','editor','viewer');


CREATE TABLE "user" (
    id serial not null primary key,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "createdAt" timestamp with time zone default CURRENT_TIMESTAMP not null,
    "updatedAt" timestamp with time zone default CURRENT_TIMESTAMP not null,
    "role" user_role_enum
);
