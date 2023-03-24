import nc from 'next-connect';
import DB from "@/utils/DB";
import Product from "@/models/Product"
import { useSession } from "next-auth/react";

const handler=async(req,res)=>{
  const {method}=req;
  // console.log(req.body);
  console.log(method);
  await DB.connect();
  // await ProductItem.deleteMany();
  // await ProductItem.insertMany(data.products)
  switch (method) {
      case 'DELETE':
        try {
          
          // await DB.connect();
          const id= JSON.parse(req.body).id;
          console.log(id);  
          const product = await Product.findById(id);
          
          if (product) {
            await product.remove();
            res.send({ message: 'Product Deleted' });
          } else {
            res.status(404).send({ message: 'Product Not Found' });
          }
        } catch (error) {
          console.log("Error");
          console.log(error);
          res.status(400).json({ success: false })
        }
        break;
      case 'PUT':
        // console.log("Here")
        try {
          // console.log("here")
          // console.log(req.body)
          const id= req.body.id;
          //  console.log(id);
          const product = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          })
          if (!product) {
            return res.status(400).json({ success: false })
          }
          res.status(200).json({ success: true, data: product })
        } catch (error) {
          res.status(400).json({ success: false })
        }
        break
        
      default:
        res.status(400).json({ success: false })
        break;
    }
  await DB.disconnect();
  res.send({message:"Successful"});
}
export default handler;

