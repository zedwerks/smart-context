const jwt = require('jsonwebtoken');
const http = require('http');
const axios = require('axios');
const jwksClient = require('jwks-rsa');

const issuer = process.env.ISSUER;
const jwksUri = process.env.JWKS_URI;
const clientId = process.env.CLIENT_ID || null;
const neededScopes = process.env.SCOPES || "context:read";

function getJwksUri() {
    //  this should work, but it returns null when called within getPublicKey()
    //  So, I'm using a env variable instead
    const wkeUri = process.env.ISSUER + '/.well-known/openid-configuration';

    axios.get(wkeUri).then(response => {
        console.log('jwks_uri: ', response.data.jwks_uri);
        return response.data.jwks_uri;
    });
    return null;
}

// Function to get the public key
function getPublicKey(header, callback) {

    const client = jwksClient({
        jwksUri: jwksUri,
    });

    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            console.log('Error in getSigningKey:', err);
            callback(err, null);
        }
        const publicKey = key.publicKey || key.rsaPublicKey;

        if (header.alg && key.alg !== header.alg) {
            callback(new Error('mismatch key algorithm'), null);
        }
        console.log('publicKey: ', publicKey);
        callback(null, publicKey);
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

        jwt.verify(token, getPublicKey, (err, decodedToken) => {
            if (err) {
                console.log('Error during jwt.verify()', err);
                return res.sendStatus(401);
            }
            if (decodedToken && decodedToken.exp < Date.now() / 1000) {
                console.log('Error: token expired');
                return res.sendStatus(401);
            }
            if (decodedToken && decodedToken.iss !== issuer) {
                console.log('Error: invalid issuer');
                return res.sendStatus(401);
            }
            if (decodedToken && decodedToken.clientId !== clientId) {
                console.log('Error: invalid client');
                return res.sendStatus(401);
            }
            if (decodedToken && decodedToken.scopes) {
                const scopes = decodedToken.scopes.split(' ');
                if (!neededScopes.split(' ').some(scope => scopes.includes(scope))) {
                    return res.sendStatus(401);
                }
            }
            console.log('JWT decoded and validated: ', decodedToken);
            next();
        });
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
            console.log('x-api-key is missing or not valid')
            res.sendStatus(401);
        }
    }
}
