.PHONY : test fillRedis getValuesViaApi

test:
	docker-compose down -v
	docker-compose up -d --build
	docker-compose run --rm proxy npm run test
	docker-compose down -v

start:
	docker-compose down -v
	docker-compose up -d --build

stop:
	docker-compose down -v
	docker-compose up -d --build

fillRedis:
	docker-compose up -d
	docker-compose run --rm -T proxy npm run populate_redis

getValuesViaApi:
	docker-compose up -d
	docker-compose run --rm -T proxy npm run get_values_via_api $@

