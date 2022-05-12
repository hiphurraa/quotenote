import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { validateRegisterInput } from "../validation/registration.js";
import { validateLoginInput } from "../validation/login.js";
import jwtAuth from "../authentication/jwtAuthentication.js";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const mailer = nodemailer.createTransport({
  host: 'smtp.gmail.com',
    port: 465,
    secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

//Registration (create user)
export const register = async (req, res) => {
  //Validate request data
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.emailExists(req.body.email)
    .then((emailResult) => {
      User.nameExists(req.body.name)
        .then((nameResult) => {
          let errors = {};
          if (emailResult) {
            errors.email = "Email already in use";
          }
          if (nameResult) {
            errors.name = "Name already in use";
          }
          if (nameResult || emailResult) {
            return res.status(400).json(errors);
          }
          //Create new user details otherwise
          const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          };

          //Hash password before inserting into database
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              User.create(newUser)
                .then((data) =>{
                  const user = data[0];
                  User.addRole(user.id, 1);
                  sendConfirmationEmail(user);
                  res.status(200).json({ message: "User registered" });
                }
                )
                .catch((err) => {
                  console.log(err);
                  res
                    .status(500)
                    .json({ message: "Server error, try again later." });
                });
            });
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "Server error, try again later." });
        });
    })
    //If user already exists, prevent registration
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Server error, try again later." });
    });
};

//Login
export const login = async (req, res) => {
  //Validate request data
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

    //Check the password, if it's correct then respond with JWT access token and refresh token
    User.getPasswordHash(req.body.email)
        .then(result => {
            //If there is no result, email is not found in db => 404 not found
            if(!result)
                return res.status(404).json({message:'User not found'});
            //Make sure given password matches one in db
            const passwordHash = result.password;
            bcrypt.compare(req.body.password, passwordHash, (error, isPasswordCorrect) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({message:"Server error, try again later."});
                }
                else if (isPasswordCorrect){
                  User.getByEmail(req.body.email)
                  .then(async (user) => {
                            if(!user.is_active) return res.status(409).json({ title: "Please confirm your email" });
                            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
                            let roles = await User.getRoles(user.id);
                            roles = roles.map(role => role.name);
                            res.status(200).json({accessToken, roles: roles});
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({message:"Server error, try again later."});
                        });               
                }
                else {
                    res.status(401).json({password: "Incorrect password"});
                }
            })
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Server error, try again later." });
    });
};

//Get all users from database
export const getAll = async (req, res) => {
  User.getAll()
    .then((data) =>
      res
        .status(200)
        .json({ title: "Retrieved all users", data })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Server error, try again later." });
    });
};

//Get a user from database
export const get = async (req, res) => {
  const id = req.params.id;
  User.getById(id)
    .then((data) => {
      console.log(data);
      res.status(200).json({ title: "Retrieved user", data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Server error, try again later." });
    });
};

export const confirmEmail = async (req, res) => {
  const token = req.params.token;
  console.log(token);
  jwt.verify(token, process.env.REGISTRATION_SECRET, (err, user) => {
    if(err) return res.status(400).json({ title: "Invalid token" });
    User.confirmEmail(user.id)
      .then(res.status(200).json({ title: "Email confirmed" }))
      .catch(err => res.status(500).json({ title: "Error confirming email, please try again later." }));
  });
}


const sendConfirmationEmail = async (user) => {
  const token = jwt.sign(user, process.env.REGISTRATION_SECRET, {
    expiresIn: "365d",
  });
  const url = `http://localhost:3000/confirmation/${token}`;
  const mailOptions = {
    to: user.email,
    subject: 'Confirm email',
    html: `Please confirm your email by clicking the link below:<br> <a href="${url}">${url}</a>`
  };
  mailer.sendMail(
    mailOptions,(err, res) => {
    if(err) console.log(err);
  });
};

export const deleteUser = async (req,res) => {
  const userIdForDeletion = parseInt(req.params.id);
  const userIdRequester = parseInt(req.user.id);
  const result = await User.getRoles(userIdRequester);
  const roles = result.map((role) => role.name);

  if(!req.body.password){
    return res.status(400).json({ password:"Confirm delete with password"})
  }

  if (roles.includes("admin") || roles.includes("moderator")) { //Admins and moderators can delete user
    User.deleteById(userIdForDeletion)
    .then(data => {
      if (data) {res.status(200).json({ title: "Deleted user as admin/moderator", data });}
      else {res.status(400).json({title: "User not found"});}
    })
    .catch(err => {
      res.status(500).json(err);
    });
  }
  else {
    if (userIdRequester === userIdForDeletion) { //User can delete his/her own account
      const passwordHash = await User.getPasswordHash(req.user.email);
      bcrypt.compare(req.body.password, passwordHash.password, (error, isPasswordCorrect) => {
        if(error){
          console.log(error);
          return res.status(500).json({message:"Server error, try again later."});
        }
        else if(isPasswordCorrect){
          User.deleteById(userIdForDeletion)
          .then(data => {
            if (data) {res.status(200).json({ title: "Deleted user", data });}
            else {res.status(400).json({title: "User not found"});}
          })
          .catch(err => {
            res.status(500).json(err);
          });
        }else{
          return res.status(401).json({password:"Incorrect password"});
        }
      })

    }
    else {res.status(401).json({ title: "Unauthorized" });}
  }
};