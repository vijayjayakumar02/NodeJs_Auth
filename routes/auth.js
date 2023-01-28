const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validate');

//Register 
router.post('/register',async (req, res)=> {
    //validate data before adding user
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //duplicate check
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send('email already exists');

    //hashing
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);


    //usermodel
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (err) {
        res.status(400).send(err);
    }
});

//login
router.post('/login', async (req, res) => {
    //validate data before login
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //check email
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('email is not found');

    //password validation
    const validatePassword = await bcrypt.compare(req.body.password, user.password);
    if(!validatePassword) return res.status(400).send('Invalid Password');

    //create token
    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

})
module.exports = router;