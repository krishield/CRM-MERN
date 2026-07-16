import mongoose from "mongoose";

const Connection = async () => {
    try{
        await mongoose.connect(
            `mongodb://localhost:27017/`,
            {
              dbName: "admin",
              useNewUrlParser: true,
              useUnifiedTopology: true,
            });
        console.log("Database connected successfully");
    }catch(error){
        console.log("error connecting Database",error);
    }
}

export default Connection;