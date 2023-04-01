import DB from "@/utils/DB";
import Product from "@/models/Product"

const handler=async(req,res)=>{
  const {method}=req;
  console.log(method);
  await DB.connect();
  switch (method) {
      case 'DELETE':
        try {
          const id= JSON.parse(req.body).id;
          const product = await Product.findById(id);
          const imageURL = product.image;
          const public_id = imageURL.split("/").pop().split(".")[0];
          console.log(public_id);
          const res = await delete(
            `https://api.cloudinary.com/v1_1/dpeauwce7/image/destroy`,
            {
              data: {
                public_id,
              },
            }
          );

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
        try {
          console.log("Here")
          console.log(req.body)
          const id= req.body.id;
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

