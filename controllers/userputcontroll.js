import user from "../model/user.js"

export const userputcontroller = async (req, resp, next) => {
    const { name, email, lastName, location } = req.body
    if (!name || !email || !lastName || !location) {
        next("Provide all Fields")
    }
    const updateuser = await user.findOne({ _id: req.loggeduser.userId })
    updateuser.name = name
    updateuser.lastName = lastName
    updateuser.email = email
    updateuser.location = location

    await updateuser.save()
    const token = updateuser.createJWT()
    resp.status(200).json({
        updateuser,
        token
    });
}



export const usergetcontroller = async (req,resp,next)=>{
    const alluser = await user.find();
    resp.status(200).json({
        message: "All User Retrieved...!!",
        alluser
    });
}