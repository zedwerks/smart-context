const { get } = require('express/lib/response');
const jwt = require('jsonwebtoken');
const http = require('http');

var jwksClient = require('jwks-rsa');

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

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, getKey, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}


module.exports = auth;