SERVICE=saasbot

up:
	docker-compose up --build -d

down:
	docker-compose down

logs:
	docker-compose logs -f $(SERVICE)

shell:
	docker-compose exec $(SERVICE) /bin/sh

install:
	docker-compose exec $(SERVICE) npm install

build-ts:
	docker-compose exec $(SERVICE) tsc

test:
	docker-compose exec $(SERVICE) npm test

.PHONY: up down logs shell install build-ts test
