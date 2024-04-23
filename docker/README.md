COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build
docker-compose down -v
docker-compose up --build --force-recreate

# With Docker - Multiple Deployment Environments

This examples shows how to use Docker with Next.js and deploy to multiple environment with different env values. Based on the [deployment documentation](https://github.com/vercel/next.js/tree/canary/examples/with-docker-multi-env).

## Using Docker and Makefile

### Development environment - for doing testing

```
make build-development
make start-development
```

Open http://localhost:3000

### Staging environment - for doing UAT testing

```
make build-staging
make start-staging
```

Open http://localhost:3002

### Production environment - for users

```
make build-production
make start-production
```

Open http://localhost:3003

## Running Locally

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
