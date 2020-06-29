const mongoose = require('mongoose');
const {ObjectId}=mongoose.Schema

const productSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description:{
        type:String,
        required:true,
        maxLength:2000,
        trim:true
        
    },
    price:{
        type:Number,
        required:true,
        trim:true
    }
    ,category:{
        type:ObjectId,
        ref:"Category",
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    sold:{
        type:Number,
        default:0
    },
    
    image:{
        data: Buffer, 
        contentType: String ,
      
    
    }
},
    {
        timestamps: true
    }
)


const Product = mongoose.model("Product", productSchema)
module.exports = Product
