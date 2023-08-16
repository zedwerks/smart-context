const { get } = require('express/lib/response');
const jwt = require('jsonwebtoken');
const http = require('http');

var jwksClient = require('jwks-rsa');
const { verify } = require('crypto');

function getJwksUri() {
    var wkeUri = process.env.ISSUER + '/.well-known/openid-configuration';

    http.get(wkeUri, (response) => {
        if (err) {
            console.log(err);
        } else {
            var result = JSON.parse(response.body);
            console.log('WKE data: ' + result);
            return result.jwks_uri;
        }
    });
    return null;
}

function getKey(header, callback) {
    var jwksClient = require('jwks-rsa');
    var client = jwksClient({
        jwksUri: getJwksUri()
    });
    client.getSigningKey(header.kid, function (err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

const tokenAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, getKey, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            if (decodedToken && decodedToken.exp > Date.now() / 1000) {
                return res.sendStatus(401);
            }
            if (decodedToken && decodedToken.iss !== process.env.ISSUER) {
                return res.sendStatus(401);
            }
            if (decodedToken && decodedToken.aud !== process.env.AUDIENCE) {
                return res.sendStatus(401);
            }
            if (decodedToken && decodedToken.scopes) {
                const scopes = decodedToken.scopes.split(' ');
                if (!process.env.SCOPES.split(' ').some(scope => scopes.includes(scope))) {
                    return res.sendStatus(401);
                }
                return res.sendStatus(401);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

const apiKeyAuth = async (req, res, next) => {
    const authHeader = req.headers[x-api-key];
    if (authHeader) {
        if (authHeader === process.env.API_KEY) {
            next();
        } else {
            res.sendStatus(401);
        }
    }
}

module.exports = { tokenAuth, apiKeyAuth };