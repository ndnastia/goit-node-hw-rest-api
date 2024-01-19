const { checkToken } = require("../services/jwtServices");
const { getUserById, loginUser } = require("../services/usersServices");
const { authUserDataValidator, userEmailValidator } = require("../utils/usersValidator");


const checkAuthUser = (req, res, next) => {
    const {value, error} = authUserDataValidator(req.body);
    req.body = value;

    if (error) {
        const validationError = new Error("Incorrect email or password!");
        validationError.status = 400;
        throw validationError;
    }
    next();

}

const checkEmail = (req, res, next) => {
    const {value, error} = userEmailValidator(req.body);
    req.body = value;

    if (error) {
        const validationError = new Error("Incorrect email!");
        validationError.status = 400;
        throw validationError;
    }
    next();

}

const protectToken = async (req, res, next) => {
    const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1];
    const userId = checkToken(token);
  
    if (!userId) throw new Error(401, 'Not authorized');
  
    const currentUser = await getUserById(userId);
  
    if (!currentUser) throw new Error(401, 'Not authorized');
  
    req.user = currentUser;
    
    next();
  };

  const restrictedLogin = async(req, res, next) => {
    const user = await loginUser(req.body);
    if(!user.verify) {
        throw new Error(400, 'User is not verified!')
    }
  }
  

module.exports = {
    checkAuthUser,
    protectToken,
    checkEmail,
    restrictedLogin
}