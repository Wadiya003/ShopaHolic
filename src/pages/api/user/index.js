//get total number of users
import DB from "@/utils/DB";
import Users from "@/models/User";

const handler=async(req,res)=>{
    const {method}=req;
    await DB.connect();
    switch (method) {
        case 'GET':
            try {
                const userinfo = await Users.find({}) /* find all the data in our database */
                /* find number of the data in our database */
                const users = await Users.find({
                    isAdmin: false
                }).countDocuments();
                res.status(200).json({ success: true, data: users, userinfo: userinfo})
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        
        case 'POST':
            try {
                const product = await Users.create(
                    req.body
                )
                res.status(201).json({ success: true, data: product })
                console.log("User added!")
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