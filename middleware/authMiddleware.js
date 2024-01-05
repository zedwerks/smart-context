const jwt = require('jsonwebtoken');
const http = require('http');
const axios = require('axios');
const jwksClient = require('jwks-rsa');

const issuer = process.env.ISSUER;
const jwksUri = process.env.JWKS_URI;
const clientId = process.env.CLIENT_ID || null;
const neededScopes = process.env.SCOPES || "context.read";

// Function to get the public key
function getPublicKey(header, callback) {

    const client = jwksClient({
        jwksUri: jwksUri,
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
    });

    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            console.error('Error in getSigningKey:', err);
            callback(err, null);
        }
        var publicKey;

        if (key === undefined || key === null) {
            console.error('key is undefined or null');
            return;
        }
        else if (key.rsaPublicKey !== undefined && key.rsaPublicKey !== null) {
            console.debug('key.rsaPublicKey: ', key.rsaPublicKey);
            publicKey = key.rsaPublicKey;
        }
        else if (key.publicKey !== undefined && key.publicKey !== null) {
            console.debug('key.publicKey: ', key.publicKey);
            publicKey = key.publicKey;
        }

        console.debug('publicKey: ', publicKey);
        callback(null, publicKey);
        return;
    });
}

exports.tokenAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (issuer === "" || issuer === undefined || issuer === null) {
        console.warn('ISSUER is not set in env');
        return res.sendStatus(401);
    }
    if (jwksUri === "" || jwksUri === undefined || jwksUri === null) {
        console.warn('JWKS_URI is not set in env');
        return res.sendStatus(401);
    }
    if (clientId === "" || clientId === undefined || clientId === null) {
        console.warn('CLIENT_ID is not set in env');
        return res.sendStatus(401);
    }
    if (neededScopes === "" || neededScopes === undefined || neededScopes === null) {
        console.warn('SCOPES is not set in env');
        return res.sendStatus(401);
    }
    else if (authHeader) {
        const token = authHeader.split(' ')[1];

        if (token === "" || token === undefined || token === null) {
            console.debug('Authorization token is missing');
            return res.sendStatus(401);
        }

        try {

            jwt.verify(token, getPublicKey, {
                issuer: issuer,
                algorithms: ['RS256'],
                clientId: clientId
            },
                function (err, decodedToken) {
                    if (err) {
                        console.log('Error during jwt.verify()', err);
                        return res.sendStatus(401);
                    }
                    if (decodedToken && decodedToken.iss !== issuer) {
                        console.log('Error: invalid issuer');
                        return res.sendStatus(401);
                    }
                    if (decodedToken && decodedToken.azp !== clientId) {
                        console.log('Error: invalid client in token');
                        console.warn('Expected clientId: ' + clientId);
                        return res.sendStatus(401);
                    }
                    if (decodedToken && decodedToken.scope) {
                        const scopes = decodedToken.scope.split(' ');
                        if (!neededScopes.split(' ').some(scope => scopes.includes(scope))) {
                            return res.sendStatus(401);
                        }
                    }
                    else {
                        console.log('Error: no scope in token');
                        return res.sendStatus(401);
                    }
                    console.log('JWT decoded and validated: ', decodedToken);
                    next();
                });
        } catch (err) {
            console.log('Error during jwt.verify()', err);
            return res.sendStatus(401);
        }
    } else {
        return res.sendStatus(401);
    }

}

exports.apiKeyAuth = async (req, res, next) => {
    const authHeader = req.headers['x-api-key'];
    const apiKey = process.env.API_KEY;

    if (apiKey === "" || apiKey === undefined || apiKey === null) {
        console.warn('API_KEY is not set in env');
        res.sendStatus(401);
    }
    else if (authHeader !== "" || authHeader !== undefined || authHeader !== null) {
        if (authHeader === apiKey) {
            next();
        } else {
            console.debug('x-api-key is missing or not valid')
            res.sendStatus(401);
        }
    }
}
