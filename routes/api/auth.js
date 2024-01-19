const express = require('express');
const { checkAuthUser, protectToken, checkEmail, restrictedLogin } = require('../../middlewares/authMiddleware');
const { registerUser, loggedUser, logoutUser, getCurrentUser, updatedAvatar, getVerifiedToken, getVerificationEmail } = require('../../controller/usersController');



const router = express.Router();

router
    .route('/register')
    .post(checkAuthUser, registerUser)

router.use(restrictedLogin)

router
    .route('/login')
    .post(checkAuthUser, loggedUser)

router.use(protectToken)


router
    .route('/verify/:verificationToken')
    .get(getVerifiedToken)

router
    .route('/verify')
    .post(checkEmail, getVerificationEmail)

router
    .route('/logout')
    .post(logoutUser)

router
    .route('/current')
    .get(getCurrentUser)

router
    .route('/avatars')
    .patch(updatedAvatar)

module.exports = router