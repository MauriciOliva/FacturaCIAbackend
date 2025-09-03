import mongoose from "mongoose";

export const connect = async () => {
    try {
        mongoose.connection.on('error', ()=>{
            console.log('MongoDB | Could not be connect to mongoDB');
        })
        mongoose.connection.on('connecting', ()=>{
            console.log('MongoDB | try connecting');
        })
        mongoose.connection.on('connected', ()=>{
            console.log('MongoDB | connected to mongodb');
        })
        mongoose.connection.once('opne', ()=>{
            console.log('MongoDB | connected to database');
        })
        mongoose.connection.on('reconnected', ()=>{
            console.log('MongoDB | reconnected to mongoDB');
        })
        mongoose.connection.on('disconnected', ()=>{
            console.log('MongoDB | disconnected ');
        })

        await mongoose.connect(
            `${process.env.DB_SERVICE}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
            {
                maxPoolSize: 50,
                serverSelectionTimeoutMS: 5000
            }//mongodb://127.0.0.1:27017/mydb
        )
    } catch (error) {
        console.log('data base error', error);
        
    }
}