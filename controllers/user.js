const User = require('../models/users')
const _ = require('lodash');
const {errorHandler}=require('../helper/dbError')
const userById=(req,res,next,id)=>{
    User.findById(id)
    .exec((err,user)=>{
        if(err || !user)
        {
            return res.status(400).json({
                error:"User not found!"
            })
        }
        req.profile=user;
        next()
    })
}

const read=(req,res)=>{
    res.status(200).send(req.profile)
}
const update=(req,res)=>{
    let user=req.profile
    user=_.extend(user,req.body)
    user.save()
        .then(() => {
            res.status(200).send(user)
        })
        .catch((err) => {
            const error = errorHandler(err)
            res.status(400).send(error)
        })
}
module.exports={
    userById,
    read,
    update
}