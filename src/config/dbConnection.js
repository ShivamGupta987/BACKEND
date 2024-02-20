import mongoose, { connect }  from "mongoose";

mongoose.set('strictQuery',false);

const connectionToDB = async() =>{
    try{
        const {connection} = await mongoose.connect(process.env.MONGO_URI
            );
    
        if(connection) {
            console.log(`connectioned DB : ${connection.host}`)
        }
    
        
    } catch(e){
        console.log(e);
        process.exit(1);
    }
  

}




export default connectionToDB;