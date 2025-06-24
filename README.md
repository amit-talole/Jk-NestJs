# NestJS Authentication Sample

This is a sample project demonstrating NestJS.


## How To Run Project 
- run following command : `npm i`
- make sure your db connectd 
- run db migration using  `./node_modules/db-migrate/bin/db-migrate up --config ./db-migrate-config.json -e uat` 
- After then Take a pull from db using `npx prisma db pull`
- After Pull Generate prisma schema `npx prisma generate`
- Running project run  `npm run build`

## migration create commond 

 - ./node_modules/db-migrate/bin/db-migrate create <'give table name or query name'> --config ./db-migrate-config.json -e uat

- example : `./node_modules/db-migrate/bin/db-migrate create user_table --config ./db-migrate-config.json -e uat`

## ec2 end point
- http://13.126.20.61
- health: - http://13.126.20.61/health

## test case
- i have added only few  e2e test case due to time limit over but write all service and controller test case

## what is implemented
- setup with nestJs
- added prisma ORM
- added migration support
- added authorization and authentication
- added rate limit
- setup globle config
- setup swagger
- added controller test case
- added service test case
- setup a piping 
- added a Docker file and Docker Compose
- docker image push in dockerhub
- added cicd using github action
- deploy add on ec2 using docker image 
