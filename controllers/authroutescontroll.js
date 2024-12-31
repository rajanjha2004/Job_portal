import user from "../model/user.js"

export const registerpostcontroller = async (req, resp, next) => {
    const { name, email, password } = req.body

    if (!name) {
        next("Name Required. Please Enter...")
    }

    if (!email) {
        next("User with this email already exist...")
    }

    if (!password) {
        next("password Required. Please Enter...")
    }

    const existinguser = await user.findOne({ email })
    if (existinguser) {
        return resp.status(200).send({ success: false, message: "User with this email already exist..." })
    }

    const newuser = await user.create({ name, email, password })


    const token = newuser.createJWT();
    resp.status(201).send({
        success: true,
        message: "User Created Successfully...",
        newuser: {
            name: newuser.name,
            lastName: newuser.lastName,
            email: newuser.email,
            location: newuser.location
        },
        token

    })


}




export const loginpostcontroller = async (req, resp, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        next("Please Provide all details")
    }

    const loggeduser = await user.findOne({ email })
    if (!loggeduser) {
        next("Invalid Username or Password")
    }

    const isMatch = await loggeduser.comparePassword(password);
    if (!isMatch) {
        return next("Invalid Username or Password")
    }
    const token = loggeduser.createJWT();
    resp.status(201).send({
        success: true,
        message: "Login Successful...",
        loggeduser: {
            _id: loggeduser._id,
            name: loggeduser.name,
            lastName: loggeduser.lastName,
            email: loggeduser.email,
            location: loggeduser.location,
            createdAt: loggeduser.createdAt,
            updatedAt: loggeduser.updatedAt
        },
        token

    })
}

