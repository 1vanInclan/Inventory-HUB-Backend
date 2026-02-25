import mongoose from "mongoose";
import dns from 'node:dns'

export const connectDB = async () => {

  let isConnected = false;
  //Node was defaulting to localhos
  dns.setServers(["8.8.8.8", "1.1.1.1"])
  console.log(`Tu uri es: ${process.env.MONGO_URI}`);

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI || "");
    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
    isConnected = true
  } catch(e){
    console.error(`❌ Error: ${e instanceof Error ? e.message : e}`);
    process.exit(1)
    }
  }
