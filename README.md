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

This is the simplest way to get going. 

```shell
docker compose up -d
```

### Environment Variables

```ISSUER_URI```
is the url of the Oauth 2.0 token issuer. The GET method is protected by this token.
The issuer's well-known endpoint is used to find the jwks.json endpoint for token validation.

```SCOPES``` is the list of scopes needed by the authenticated system. If absent, a 403 will be returned by the GET request.

```API_KEY``` is the single (for now) API key needed by EMR/EHR clients to be able to POST a context. We can't/don't want to require user authN since the user has not completed authentication to the SMART authorization server until the launch flow completes.  


### Notes

At this time the ```POST``` request only requires knowledge of a single API Key for now. This is set by an environment variable.

## Example API Usage

### POST to set context

```shell
curl -H
```

### GET Request to resolve context payload

This is called by the Authorization server, by taking the ```launch``` parameter and
using it in the GET request.

```shell
curl -H
```
