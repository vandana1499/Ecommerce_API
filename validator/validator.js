
const userSignUpValidator = (req, res,next) => {
   
    req.check("name", "Name is required").notEmpty()
    req.check('email').notEmpty().withMessage("Email is required").isEmail().withMessage("Provide a valid email")
 
    
    req.check('password', "Password is required").notEmpty()
    req.check("password","Password minimum length should be 7").isLength({ min: 7 })

    const errors = req.validationErrors()
    if(errors)
    {
        const err=errors.map(error=>error.msg)
        return res.status(400).json({error:err})
    }
    next()
}
module.exports={userSignUpValidator}