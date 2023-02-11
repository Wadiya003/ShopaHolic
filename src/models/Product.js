import mongoose from "mongoose";
const ProductSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        slug:{
            type:String,
            unique:true,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        brand:{
            type:String,
            required:true
        },
        category:{
            type:String,
            required:true
        },
        stock:{
            type:Number,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required:true,
            default:"https://magazine.joomla.org/images/anibal-sanchez/tailwind-grid.png"
        }
        
    },{
        timestamps:true,
    }
)
const Product=mongoose.models.Product||mongoose.model('Product',ProductSchema);
export default Product;