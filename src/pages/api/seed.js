import DB from "@/utils/DB";
import Product from "@/models/Product"
import User from "@/models/User";
import data from "@/utils/data"
import ProductItem from "@/models/Product";
const handler=async(req,res)=>{
    const {method}=req;
    await DB.connect();
    await User.deleteMany();
    await User.insertMany(data.users);
    // await ProductItem.deleteMany();
    // await ProductItem.insertMany(data.products);
    switch (method) {
        case 'GET':
          try {
            const products = await Product.find({}) /* find all the data in our database */
            res.status(200).json({ success: true, data: products })
          } catch (error) {
            res.status(400).json({ success: false })
          }
          break
        case 'POST':
          try {
            console.log(req.body)
            console.log("Here")
            const product = await Product.create(
              req.body
            ) /* create a new model in the database */
            res.status(201).json({ success: true, data: product })
            console.log("Done")
          } catch (error) {
            console.log("Error")
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