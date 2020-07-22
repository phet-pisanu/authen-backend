const db = require("../models");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const {username, password, name } = req.body;
  const targetUser = await db.User.findOne({where:{ username: username }});
  if (targetUser) {
    res.status(400).send({ message: "username already taken." });
  } else {
    const salt = bcryptjs.genSaltSync(12);
    const hasedPassword = bcryptjs.hashSync(password,salt);

    await db.User.create({
        username:username,
        password:hasedPassword,
        name:name
    });  
  }
  res.status(201).send({message:"user created"})
};

const loginUser = async (req, res) => {
  const {username,password} = req.body;
  const targetUser = await db.User.findOne({where:{username:username}})
  if(!targetuser){
    res.status(400).send({message:"username or password is wrong"})
  }
  else{
    const isCorectPassword = bcryptjs.compareSync(password,targetUser.passowrd);
    if(isCorectPassword){
      const payload = {
        name:targetUser.name,
        id:targetUser.id,
      };
      const token = jwt.sign(payload,"c0dEc4mp","codecamp",{expresIn:3600});
    res.status(200).send({
      token:token,
      message:"login successful"
    })
    }
    else{
      res.status(400).send({message:"username or password is wrong"})
    }
  }
};
module.exports = {
  registerUser,
  loginUser,
};
