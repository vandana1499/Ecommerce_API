const User =require('../models/users')
const _ = require('lodash');
const createOrder=(req,res)=>{

    let user=req.profile

    let data=[...user.history]
    data.push(req.body)
    user.history=data
    user.save()
        .then(() => {
            res.status(200).send(user)
        })
        .catch((err) => {
            const error = errorHandler(err)
            res.status(400).send(error)
        })



}
const readOrder=(req,res)=>{
    
    res.status(200).send(req.profile.history)
}
module.exports={
    createOrder,
    readOrder
}