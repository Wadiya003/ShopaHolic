import DB from "@/utils/DB";
import Product from "@/models/Product"

const handler=async(req,res)=>{
    const {method}=req;
    await DB.connect();
    switch (method) {
        case 'GET':
          try {
            /* find data by an */
            const products = await Product.find({}) 
            //get total number of products
            const total = await Product.find({}).countDocuments();
            res.status(200).json({ success: true, data: products, total: total })
          } catch (error) {
            res.status(400).json({ success: false })
          }
          break
        case 'POST':
          try {
          
            const product = await Product.create(
              req.body
            )
            res.status(201).json({ success: true, data: product })
            console.log("Product added!")
          } catch (error) {
            console.log(error);
            res.status(400).json({ success: false })
          }
          break
        default:
          res.status(400).json({ success: false })
          break
      }
    await DB.disconnect();
    res.send({message:"Successful"});
}
export default handler;