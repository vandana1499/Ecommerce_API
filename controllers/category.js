const Category =require('../models/category')
const {errorHandler}=require('../helper/dbError')
const _ = require('lodash');
const create=(req,res)=>{

    const category=new Category(req.body)
    category.save((err,data)=>{
        if(err)
        {
            console.log(err)
         return res.status(400).send({
             error:errorHandler(err)
         })
        }
        res.status(201).send({data})
    })
}
const categoryById=(req,res,next,id)=>{

    Category.findById(id)
    .exec((err,category)=>{
        if(err || !category)
        {
            return res.status(404).send({error:"Category does  not exist"})
        }
        req.category=category
        next()
    })
}
const read=(req,res)=>{
    return res.status(200).send(req.category)
}
const update=(req,res)=>{
    let category=req.category
    category=_.extend(category,req.body)
    
    category.save((err,data)=>{
        if(err)
        {
         return res.status(400).send({
             error:errorHandler(err)
         })
        }
        res.status(201).send({data})
    })
}
const deleteCategory=(req,res)=>{

    let category=req.category;
    category.remove((err,result)=>{
        if(err)
        {
            return res.status(400).send({error:err})
        }
        res.status(200).send("Deleted the product successfully")
    })
}
const categoryList=(req,res)=>{
    
    Category.find({},(err,result)=>{
        if(err)
        {
            return res.status(404).send({error:"No categories presemt yet!"})
        }
        res.status(200).send({result})
    })
   

}
module.exports={
    create,
    categoryById,
    read,
    update,
    deleteCategory,
    categoryList
}
