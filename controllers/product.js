const Product =require('../models/product')
const _ = require('lodash');
const formidable = require('formidable');
const fs=require('fs')
const {errorHandler}=require('../helper/dbError')
const create=(req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req,(err,fields,files)=>{
    
     
        if(err)
        {
         return res.status(400).send({err:"Image could not be uploaded"})
        }

         const {name,description,quantity,price,category}=fields
       

         if(!name || !description|| !quantity|| !files.image|| !price || !category)
         {
            
             return res.status(400).send({error:"All fields are required"})
         }
         let product=new Product(fields)

         if(files.image)
         {
            // console.log(files.image.size)
             if(files.image.size >1000000)
             {
                 return res.status(400).send("Image size is large !!")
             }
             product.image.data=fs.readFileSync(files.image.path)
             product.image.contentType=files.image.type;
            console.log(files.image)
         }
         product.save((err,result)=>{
             if(err)
             {
                 console.log(err)
                 return res.status(400).send({error:errorHandler(err)})
             }
             res.status(201).send({result:result})
         })
    });   
}

const productById=(req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err || !product)
        {
           
            return res.status(400).json({
                error:"Product not found!"
            })
        }
        req.product=product;
        next()
    })
}

const read=(req,res)=>{
    req.product.image=undefined
    res.status(200).send(req.product)
}
const deleteProduct=(req,res)=>{

   let product =req.product
   product.remove((err,result)=>{
       if(err)
       {
        return res.status(400).send({error:err})
       }

       res.status(200).send("Deleted")
   })

}
const update=(req,res)=>{

    let form = new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req,(err,fields,files)=>{
    
        if(err)
        {
         return res.status(400).send({err:"Image could not be uploaded"})
        }

        
         let product=req.product
        product=_.extend(product,fields)

         if(files.image)
         {
            // console.log(files.image.size)
             if(files.image.size >1000000)
             {
                 return res.status(400).send("Image size is large !!")
             }
             product.image.data=fs.readFileSync(files.image.path)
             product.image.contentType=files.image.type;
         }
         product.save((err,result)=>{
             if(err)
             {
                //  console.log("hheh")
                //  console.log(err)
                 return res.status(400).send({error:errorHandler(err)})
             }
             res.status(201).send({result:result})
         })
    });
    
}

//filters on the basis of the most sold or arrival

//  most sold /products/sortBy=sold&order=asc&limit=6
// arrival /productsortBy=createdAt&order=asc&limit=6
//no paramater , all products are shown

const productList=(req,res)=>{

    let order=req.query.order ? req.query.order :"asc";
    let sortBy=req.query.sortBy ?req.query.sortBy :"_id"
    let limit=req.query.limit ? req.query.limit :5
    limit=parseInt(limit)

    Product.find()
     .select("-image")
    .populate("category")
    .sort([[sortBy,order]])
    .limit(limit)
    .exec((err,result)=>{

        if(err)
        {
            return res.status(400).send({error:"Products not found"})
        }
        res.send(result)
    })
}
const listRelatedProducts=(req,res)=>{
 
    let limit=req.query.limit ? req.query.limit :6
    limit=parseInt(limit)
    Product.find({_id:{$ne:req.product._id},category:req.product.category})
    .limit(limit)
    .populate("category","_id name")
    .exec((err,result)=>{
        if(err)
        {
            return res.status(400).send({error:"Products not found"})
        }
        res.send(result)
        
    })


}
const productCategories=(req,res)=>{
    Product.distinct("category",{},(err,result)=>{
        if(err)
        {
            return res.status(400).send({error:"Products not found"})
        }
        res.send(result)
    })
}

const listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
              
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
         .select("-image")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, result) => {
            if (err) {
                return res.status(400).send({
                    error: "Products not found"
                });
            }
            res.status(200).send({
                size: result.length,
                result
            });
        });
}

const image=(req,res,next)=>{

    if(req.product.image.data)
    {
        res.set("Content-type",req.product.image.contentType)
        return res.send(req.product.image.data)
    }
    next()

}
const listSearch=(req,res,next)=>{

    const query={}
    if(req.query.search)
    {
        query.name={$regex:req.query.search,$options:"i"}
        if(req.query.category&& req.query.category!="All")
        {
            query.category=req.query.category
        }

    }
    Product.find(query,(err,products)=>{
        if(err)
        {
            console.log(err)
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
            res.json(products)
    }).select("-image")

}
module.exports={
    create,
    productById,
    read,
    deleteProduct,
    update,
    productList,
    listRelatedProducts,
    productCategories,
    listBySearch,
    image,
    listSearch
}