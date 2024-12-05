const express=require('express');
const router=express.Router();
const User=require('./../models/user');
const {jwtAuthMiddleware,generateToken}=require('./../jwt');

//post route to add a person
router.post('/signup',async (req,res)=>{
    try{
      const data=req.body;//assuming the req body contains the person data
      //create a new person document using the mongoose model
      const newUser= new User(data);
      // newPerson.name=data.name;
      // newPerson.age=data.age;
      // newPerson.mobile=data.mobile;
      // newPerson.address=data.address;
      
      //save the data to the database
      const response= await newUser.save();
      console.log('data saved');

      const payload={
        id:response.id,
       

      }

const token=generateToken(payload);
console.log('Token is: ',token);


      res.status(200).json({response:response,token:token});
    }catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal server error'});
    }
    
})

//login page
router.post('/login',async (req,res)=>{
  try{
    //extract username and pass from req body
    const {aadharCardNumber,password} =req.body;
    //find the user by username
    const user=await User.findOne({aadharCardNumber:aadharCardNumber});
    //if user doesn't exist or pass not matched then showing error
    if((!user) || !(await user.comparePassword(password))){
      return res.status(401).json({error: 'Invalid username or password'});
    }

    //generate token

    const payload={
      id:response.id,
 

    }
    const token=generateToken(payload);
    //return token as response
    res.json(token);
  }catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal server error'});
    }
  }
)

// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



router.put('/profile/password',jwtAuthMiddleware, async (req,res)=>{
try{
  const userId=req.user; //extract the id from the url parameter
  const {currentPassword,newPassword}=req.body; //updated data for the person
  const user=await User.findById(userId);
  if(!(await user.comparePassword(currentPassword))){
    return res.status(401).json({error: 'Invalid username or password'});
  }

  user.password=newPassword;
  await user.save();
  console.log('data updated');
  res.status(200).json(response);
}catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal server error'});
}
})

module.exports=router;