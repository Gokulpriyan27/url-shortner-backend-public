const url_model = require("../models/UrlModel");
const userModel = require("../models/UserModel")

const urlPostRoute = async(req,res)=>{
    try {
        const payload = req.body;
        const findUserUrls = await url_model.find({userid:req.params.userid});

        let existingUrls = [];

        for(let each of findUserUrls){
           existingUrls.push(each.originalUrl)
        }

         if(existingUrls.includes(payload.originalUrl)){
            return res.status(200).send({message:"Url already exists"})
        }else{
            const posturl = await new url_model({...payload,userid:req.params.userid});
            await posturl.save();
            return res.status(201).send({message:"url stored",url:`${process.env.backend_url}/api/${posturl.short_id}`})

        }
      
    } catch (error) {
        return res.status(500).send({message:"Error while generating url"})
    }
}


const gotoUrl = async(req,res)=>{
    try {
        const id = req.params.shortid;
        
        const findUrl = await url_model.findOne({short_id:id});
        const redirectUrl = findUrl.originalUrl;
        res.redirect(redirectUrl);

    } catch (error) {
        return res.status(500).send({message:"Error getting the url"})
    }
}


const getallUrls = async(req,res)=>{
    try {
        const getUrls = await url_model.find({userid:req.params.userid});
        if(getUrls){
           
            return res.status(200).send({data:getUrls})
        }else{
            return res.status(401).send({message:"Could find the user"})
        }
    } catch (error) {
        return res.status(500).send({message:"Error getting the urls"})
    }
}

const urlCreatedPerDay = async(req,res)=>{
    try {
        const userid = req.params.userid;
        const findDate = req.body.date;        
        const findUser = await url_model.find({userid:userid});
        
        //filter date;

        const getData = findUser.filter((urldata)=>{
            
        
            const date1 = urldata.createdAt;
            
            let date = date1.toISOString().slice(0,10);
                    
            return (date===findDate);
        })

        if(getData.length>0){
            return res.status(200).send({data:getData})
        }else{
            return res.status(204).send({message:"No url's found"})
        }
        
    } catch (error) {
        return res.status(500).send({error:error})
    }
}

const urlCreatedperMonth =async(req,res)=>{
    try {
        const findMonth = req.body.month;
        
        const findUser = await url_model.find({userid:req.params.userid})
    
        //get month information

        const getMonth = findUser.filter((userdata)=>{
            let getData = userdata.createdAt.getMonth()+1;
            return (Number(findMonth)===getData);
        })
        
        if(getMonth.length>0){
            return res.status(200).send({data:getMonth})
        }else{
            return res.status(204).send({message:"no url's found"})
        }
    } catch (error) {
        
    }
}

module.exports = {urlPostRoute,gotoUrl,getallUrls,urlCreatedPerDay,urlCreatedperMonth}