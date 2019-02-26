//@login && register
const express=require("express");
const router=express.Router();
const bcrypt=require("bcrypt");
const gravatar=require("gravatar");
const jwt=require("jsonwebtoken");
const keys=require("../../config/keys");
const passport=require("passport");

// const cert=fs.readFileSync('private.key'); //得到private.key


const User=require("../../models/Users");

//$router GET api/users/test
//@desc 返回请求的json 数据
//@access public
router.get("/test",(req,res)=>{
    res.json({
        msg:"login works"
    })
});

//$router POST api/users/register
//@desc 返回请求的json 数据
//@access public
router.post("/register",(req,res)=>{

    //console.log(req.body)
//查询数据库中否拥有邮箱
    User.findOne({email:req.body.email})
        .then(user=>{

            if(user){
                return res.status(400).json("邮箱已被注册！")
            }else{
                // const avatar = gravatar.url(req.body.email, {
                //     s: '200',
                //     r: 'pg',
                //     d: 'mm'
                // });
                const newUser=new User({
                    name:req.body.name,
                    email:req.body.email,
                    avatar:'//upload.jianshu.io/users/upload_avatars/8794764/18e156ab-c8d9-4851-bd00-f4e0c17d3ce2?imageMogr2/auto-orient/strip|imageView2/1/w/240/h/240',
                    password:req.body.password,
                    identity:req.body.identity
                })
                bcrypt.genSalt(10,function (err,salt) {
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw  err;
                        newUser.password=hash;
                        newUser.save()
                            .then(user=>res.json(user))
                            .catch(err=>console.log(err))
                    })

                })
            }
        })
});

//$router POST api/users/login
//@desc 返回token jwt passport
//@access public

router.post("/login",(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    //查询数据库
    User.findOne({email})
        .then((user)=>{
            if(!user){
                return res.status(404).json("用户不存在！")
            }
            bcrypt.compare(password,user.password)
                .then((isMatch)=>{
                    if(isMatch){
                      // jwt.sign("规则","加密名字","过期时间","箭头函数")
                        const rule={
                            id:user.id,
                            name:user.name,
                            avatar:user.avatar,
                            identity: user.identity
                        };
                        jwt.sign(rule,keys.secretOrKey,{expiresIn: 1800},(err,token)=>{ //设置过期时间
                            if(err) throw err;
                            res.json({
                                success:true,
                                token:"Bearer "+token
                            });
                        })
                    }else{
                        return res.status(400).json("密码错误！");
                    }

                })
        })
});

//$router GET api/users/current
//@desc 返回请求的json 数据
//@access Private
router.get("/current",passport.authenticate("jwt",{session:false}),(req,res)=>{
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email,
        identity:req.user.identity
    })
})

module.exports=router;