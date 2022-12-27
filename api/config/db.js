import mongoose from "mongoose";

//create a mongoDB connection
const mongoDBConnection = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_STRING);
    console.log(`mongo DB connected successfully`.bgBlue.black);
  } catch (error) {
    console.log(error);
  }
};

// export mongo connectiom
export default mongoDBConnection;
