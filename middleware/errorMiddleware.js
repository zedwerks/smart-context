const errorCatcher = (err, req, res, next) => {
    res.json({
        code: err.statusCode,
        message: err.message
    })
}

module.exports = errorCatcher