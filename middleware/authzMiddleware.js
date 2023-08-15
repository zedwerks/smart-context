const jwt = require('jsonwebtoken');
var jwksClient = require('jwks-rsa');

function getJwksUri() {
    // to be replaced with a call to the issuer's well-known endpoint
    return process.env.JWKS_URI;
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