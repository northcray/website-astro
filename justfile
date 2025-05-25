build:
    docker build $(sed 's/^/--build-arg /' .env.production) . -t website:latest