const jwt = require('jsonwebtoken');
const http = require('http');

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

exports.tokenAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const issuer = process.env.ISSUER;
    const audience = process.env.AUDIENCE || "smart-authz";
    const neededScopes = process.env.SCOPES || "context:read";

    if (issuer === "" || issuer === undefined || issuer === null) {
        console.warn('ISSUER is not set in env');
        res.sendStatus(401);
    }

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, getKey, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            if (decodedToken && decodedToken.exp > Date.now() / 1000) {
                return res.sendStatus(401);
            }
            if (decodedToken && decodedToken.iss !== issuer) {
                return res.sendStatus(401);
            }
            if (decodedToken && decodedToken.aud !== audience) {
                return res.sendStatus(401);
            }
            if (decodedToken && decodedToken.scopes) {
                const scopes = decodedToken.scopes.split(' ');
                if (!neededScopes.split(' ').some(scope => scopes.includes(scope))) {
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
