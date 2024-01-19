const User = require("../models/usersModel");
const { signToken } = require("./jwtServices");
const ImageService = require('./imageServices');
const Email = require('./emailServices');
const { nanoid } = require("nanoid");



const createUser = async (userData) => {
    const verificationToken = nanoid();
    const {email} = userData;
   
    const user = await User.findOne({email});
    if(user) {
        console.error('Email in use');
        throw new Error(409, "Email in use")
    }
    try {
    const newUser = await User.create({...userData, verificationToken});
    
    await new Email(newUser, `http://localhost:3000/api/users/verify/${verificationToken}`).sendVerificationToken();
    newUser.password = undefined;

    const token = signToken(newUser.id)

    return {user: newUser, token, verificationToken};
    } catch(error) {
        console.error('Error creating user:', error.message);
        throw error;
    }
    
}


const loginUser = async ({email, password}) => {
    const user = await User.findOne({email}).select('+password');
    if(!user) {
        
        throw new Error(401, "Email or password is wrong");
    }

    const passwordIsValid = await user.checkPassword(password, user.password)

    if(!passwordIsValid) {
        throw new Error(401, "Email or password is wrong");
    }

    user.password = undefined;

    const token = signToken(user.id)

    return {user, token}
}

const getUserById = async(id) => {
    const user = await User.findById(id);

    if(!user) {
        throw new Error(401, "Not authorized")
    }

    const token = null
    await user.save();
    return token;
}


const updateAvatar = async(userData, user, file) => {
    if (file) {
        user.avatar = await ImageService.saveImage(
          file,
          { maxFileSize: 1.2, width: 100, height: 100 },
          'tmp',
          user.id
        );
      }
    
      Object.keys(userData).forEach((key) => {
        user[key] = userData[key];
      });
    
      return user.save();
    
}

    
const getUserByToken = async(verificationToken) => {
    const user = await User.findOne(verificationToken);

    if(!user) {
        throw new Error(404, "Not found")
    }

    user.verificationToken = null;
    user.verify = true;

    return user.save();
}

const sendVerificationEmail = async(userData) => {
    const {email, verificationToken} = userData;
    const user = await User.findOne({email});
    if(!email) {
        throw new Error(400, 'Missing required field email');
    }

    if(verificationToken) {
        throw new Error(400, 'Verification has already been passed' )
    }

    if(!verificationToken) {
    user.verificationToken = nanoid();
    await new Email(user, `http://localhost:3000/api/users/verify/${user.verificationToken}`).sendVerificationToken();
    }
}

module.exports = {
    createUser,
    loginUser, 
    getUserById,
    updateAvatar,
    getUserByToken,
    sendVerificationEmail,
}
