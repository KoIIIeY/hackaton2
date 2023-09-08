docker compose up -d

-> http://localhost

болтаем!



что бы изменить код в питоне: 

1) меняем код в python-test-server
2) docker compose build python

python тут - название контейнера, название берется в файле docker-compose.yml (в блоке services - названия сервисов, а уже в них конфиги)
