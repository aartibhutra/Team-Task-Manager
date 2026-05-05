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
    const result = await User.updateMany(
      { email: { $regex: /@admin\.com$/i } },
      { $set: { role: 'Admin' } }
    );
    console.log(`Updated ${result.modifiedCount} users to Admin role.`);
    mongoose.connection.close();
  })
  .catch(err => console.log(err));
