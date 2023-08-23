#!/bin/sh
# script to start the server on cli.
export ISSUER=http://localhost:8080/auth/realms/poc
export JWKS_URI=http://localhost:8080/auth/realms/poc/protocol/openid-connect/certs
export CLIENT_ID=smile-cdr
export SCOPES="launch context openid"
export  API_KEY=e7ce47e88053fa31998de414423e82c47fd479688be5ad8dd9ecc0ac61108a8b
npm start