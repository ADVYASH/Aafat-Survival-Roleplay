const express = require("express");
const axios = require("axios");
const session = require("express-session");

const app = express();

app.use(session({
secret:"asrpsecret",
resave:false,
saveUninitialized:true
}));

const CLIENT_ID = "1480639407873724608";
const CLIENT_SECRET = "8jzYjLaz8UeNbKXh1OpsNPnivoyzrRao";
const REDIRECT = "http://localhost:3000/callback";

/* PUBLIC LOGIN */

app.get("/login/public",(req,res)=>{

req.session.page="public";

const url=`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT)}&response_type=code&scope=identify`;

res.redirect(url);

});

/* CREATOR LOGIN */

app.get("/login/creator",(req,res)=>{

req.session.page="creator";

const url=`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT)}&response_type=code&scope=identify`;

res.redirect(url);

});

/* CALLBACK */

app.get("/callback", async (req,res)=>{

const code=req.query.code;

const token=await axios.post("https://discord.com/api/oauth2/token",
new URLSearchParams({
client_id:CLIENT_ID,
client_secret:CLIENT_SECRET,
grant_type:"authorization_code",
code:code,
redirect_uri:REDIRECT
}),
{headers:{'Content-Type':'application/x-www-form-urlencoded'}}
);

const user=await axios.get("https://discord.com/api/users/@me",{
headers:{Authorization:`Bearer ${token.data.access_token}`}
});

req.session.user=user.data;

/* redirect to correct page */

if(req.session.page==="creator"){
res.redirect("/creator.html");
}else{
res.redirect("/public.html");
}

});

app.listen(3000);
