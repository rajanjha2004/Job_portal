const errormiddleware = (err, req, resp, next) => {

    console.error(err);
    const defaultError = {
        statusCode: 500,
        message: err
    }

    if (err.name === 'ValidationError') {
        defaultError.statusCode = 400
        defaultError.message = Object.values(err.errors).map(item => item.message).join(",");
    }

    resp.status(defaultError.statusCode).json({ message: defaultError.message });

};

export default errormiddleware;