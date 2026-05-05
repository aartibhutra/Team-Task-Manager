const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String
}, { collection: 'users' });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const users = await User.find({});
    console.log("Users in DB:");
    users.forEach(u => console.log(`"${u.email}" - Role: "${u.role}"`));
    mongoose.connection.close();
  })
  .catch(err => console.log(err));
