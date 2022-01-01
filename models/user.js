import  Mongoose  from "mongoose";

const userSchema = Mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    id: {type: String},
});
      
const User = Mongoose.model('User', userSchema);;
export default User;
//single collection name //data type
// export default 
