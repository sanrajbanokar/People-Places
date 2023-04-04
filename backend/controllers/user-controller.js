const HttpError = require('../models/http-error');
const {uuid} = require('uuidv4');
const {validationResult} = require('express-validator');

let DUMMY_USERS = [
    {
        id: 'u1',
        name:"Sanraj Banokar",
        email:"sanraj@test.com",
        password: "testers"
    },
    {
        id: 'u2',
        name:"Shivangi Goyal",
        email:"shivangi@test.com",
        password: "testers"
    },
    {
        id: 'u3',
        name:"Rohit Dumbey",
        email:"rohit@test.com",
        password: "testers"
    },
];

const getAllUsers = (req, res, next) => {
    const users = DUMMY_USERS;
    res.status(200).json({users: users});
};

const signup = (req, res, next) => {
    const errors = validationResult(req);
    // console.log(errors)
    if(!errors.isEmpty()){
      return next(new HttpError("Invalid inputs passed, please check your data", 422))
    }
    const {name, email, password} = req.body;

    const hasUser = DUMMY_USERS.find(p=> p.email === email);

    if(!hasUser){
        const newUser = {
            id: uuid(),
            name,
            email,
            password
        };
        DUMMY_USERS.push(newUser);
    }else {
        return next(new HttpError("User is already registered, kindly login!", 409));
    }
    
    res.status(200).json({user: newUser});
};

const login = (req, res, next) => {
    const { email, password } = req.body;
      const identifiedUser = DUMMY_USERS.find(p=> p.email === email);
      if(!identifiedUser || identifiedUser.password !== password) {
          return next(new HttpError("Could not find the user, wrong credentials", 401));
      }
      res.json({message:"Logged In!"})
};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;