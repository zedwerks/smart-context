# smart-context

An example implementation of a SMART on FHIR Context API for use by clients and the authorization service to resolve launch context.

## Running

```shell
node server.js
```

## Dockerfile

```shell
docker build -t smart-context .

docker run -p 8088:8088 smart-context
```

## Docker Compose

```shell
docker compose up
```
