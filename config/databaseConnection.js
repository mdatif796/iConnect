require('dotenv').config();
const mongoose = require('mongoose');

// if connects with the database
main().then(() => {
    return console.log("Database connected successfully with the server.");
    
    // if error occurs while connecting with the database
}).catch((err) => {
    return console.log(`Error in connecting with the database: ${err}`);
});


// function for connecting with the database
async function main(){
    // await mongoose.connect(process.env.MONGODB_URI || `mongodb+srv://Admin-Atif:${process.env.DATABASE_PASS}@cluster0.lymyd.mongodb.net/?retryWrites=true&w=majority`);
    // await mongoose.connect(
    //     `mongodb+srv://${process.env.MONGO_USER}:${process.env.DATABASE_PASS}@cluster0.adv0t.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
    //     {
    //       useNewUrlParser: true,
    //       useUnifiedTopology: true,
    //     }
    //   );
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.DATABASE_PASS}@cluster0.lymyd.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`);
}