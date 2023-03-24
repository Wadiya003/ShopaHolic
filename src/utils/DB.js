import { mongoose } from 'mongoose';

const connection ={};
async function connect(){
    mongoose.set('strictQuery', true);
    if(connection.isConnected){
        console.log("Connected");
        return;
    }
    //have connection in queue
    if(mongoose?.connections?.length>0){
        //get ready state of first connection
        connection.isConnected=mongoose.connections[0].readyState;
        if(connection.isConnected===1){
            console.log("Connecteion in queue");
            return;
        }
        await mongoose.disconnect();
    }
    const db= await mongoose.connect(process.env.MONGODB_URI);
    
    connection.isConnected=db.connections[0].readyState;
    
}
//disconnect function
async function disconnect(){
    if(connection.isConnected){
        if(process.env.NODE_ENV==='production'){
            await mongoose.disconnect();
            connection.isConnected=false;
        }else{
            console.log('Not disconnected');
        }
    }
}
function convertDoctoObj(doc){
    doc._id=doc._id.toString();
    doc.createdAt = doc.createdAt.toString();
    doc.updatedAt = doc.updatedAt.toString();
    return doc;
}
const DB={connect,disconnect,convertDoctoObj};
export default DB;

