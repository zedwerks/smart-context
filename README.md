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

This is the simplest way to get going. Edit the docker-compose.yml file have the environment variables set, then run:

```shell
docker compose up -d
```

### Environment Variables

```ISSUER```
is the url of the Oauth 2.0 token issuer. The GET method is protected by this token.
The issuer's well-known endpoint is used to find the jwks.json endpoint for token validation.

This issuer must be found as the ```iss``` value in the token, or 401 is returned.

```SCOPES``` is the list of scopes needed by the authenticated system. If absent, a 401 will be returned by the GET request.

```AUDIENCE``` is the OAuth 2.0 audience that must be found in the JWT. Otherwise, a 401 is returned.

```API_KEY``` is the single (for now) API key needed by EMR/EHR clients to be able to POST a context. We can't/don't want to require user authN since the user has not completed authentication to the SMART authorization server until the launch flow completes.

For now this concept only supports a single API key. You can generate something reasonable like so:

```shell
openssl rand -hex 32
```


### Notes

At this time the ```POST``` request only requires knowledge of a single API Key for now. This is set by an environment variable.

## Example API Usage

### POST to set context

```shell
curl --location 'http://localhost:8088/api/context' \
--header 'Content-Type: application/json' \
--data '{
    "resourceType" : "Parameters",
    "parameter": [
        {
            "name": "patient",
            "resource": {
                "resourceType": "Patient",
                "use": "usual",
                "system":"urn:oid:2.16.840.1.113883.4.50",
                "type": "JHN",
                "value": "9094626885"
            }
        }
    ]
}'
```

### GET Request to resolve context payload

This is called by the Authorization server, by taking the ```launch``` parameter and
using it in the GET request.

```shell
curl --location 'http://localhost:8088/api/context/3335a882-bf12-48bb-ad78-212a46ae9297'
```
