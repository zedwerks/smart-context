# smart-context

An example implementation of a SMART on FHIR Context API for use by clients and the authorization service to resolve launch context.

## Generating Swagger Docs

```shell
npm run swagger-autogen
```

## Running

```shell
node server.js
```

or

```shell
npm start
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
