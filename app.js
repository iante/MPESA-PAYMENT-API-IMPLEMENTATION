const express = require('express')
const request = require('request')

const app = express()

app.get('/',(res,req) =>{
    res.send("")
})

app.get('/access_token',access,(req,res)=>{
    res.status(200).json({access_token:req.access_token})
})

app.get('/register',access,(req,res)=>{
let url = ""
let auth = "Bearer" + req.access_token

request({
    url:url,
    headers:{
        "Authorization":auth,
    },
    method:"POST",
    json:{
   "ShortCode":"",
    "ResponseType":"Complete",
    "ConfirmationURL":"http://197.248.86.122:801/validation",
    "ValidationURL":"http://197.248.86.122:801/confirmation"
    },
    function(error,response,body){
        if(error){
            console.log(error)
        }
        else{
            return res.status(200).json(body)
        }
    }
})

})

app.post('/confirmation', (res,req)=>{
    console.log('.......confirmation........')
    console.log(req.body)
})

app.post('/validation', (res,req)=>{
    console.log('.......validation........')
    console.log(req.body)
})

app.get('/simulate',access, (res,req)=>{
   let url = ""
   let auth = "Bearer" + req.access_token

   request({
       url:url,
       headers:{
           "Authorization":auth
       },
       method:"POST",
       json:{
         "ShortCode":"",
         "CommandId":"CustomerPayBillOnline",
         "Amount":"100",
         "Msisdn":"//get under test in daraja api",
         "BillRefNumber":""
       },
       function(error,response,body){
        if(error){
            console.log(error)
        }
        else{
            return res.status(200).json(body)
        }
    }
   })
})


//Getting Balance
app.get('/balance',access,(req,res)=>{
    let endpoint = ""
    let auth = "Bearer" + req.access_token

    request({
        url:endpoint,
        method:"POST",
        headers:{
            "Authorization":auth
        },
        json:{
        "Initiator":"apitest342",
        "SecurityCredential":"",
        "CommandId":"AccountBalance",
        "PartyA":"//shortcode goes here",
        "IdentifierType":"4",
        "Remarks":"Remarks",
        "QueueTimeOutUrl":"http://197.248.86.122:801/timeout_url",
        "ResultURL":"http://197.248.86.122:801/result_url"
        }
    },
    function(error,response,body){
        if(error){
            console.log(error)
        }else{
            res.status(200).json(body)
        }
    }
    )

    
})

//in case of error
app.post('/timeout_url',(req,res)=>{
    console.log('......Balance Timeout Response.....')
    console.log(req.body)
})

//in case of error
app.post('/result_url',(req,res)=>{
    console.log('......Balance Result Response.....')
    console.log(req.body.Response.ResponseParameters)
})


//stk push (Lipa na Mpesa Online)
app.get('/stk',access,(req,res)=>{
    let endpoint = "url for lipa na mpesa online API"
    let auth = "Bearer" + req.access_token
    let getdate = new Date()
    const timestamp = getdate.getFullYear() +""+""+ getdate.getMonth() +""+""+ getdate.getDate()+""+""+ 
    getdate.getHours()+""+""+ getdate.getMinutes()
    //converting to base64
    const password = new Buffer.from(('shortcode'+'passkey'+timestamp).toString('base64'))
    request(
        {
              
            url=endpoint,
            method:"POST",
            headers ={
                "Authorization":auth
            },
            json:{
                "BusinessShortCode":"shortcode for lipa na mpesa",
                "Password":password,
                "Timestamp": timestamp,
                "TransactionType":"CustomerPayBillOnline",
                "Amount":"",
                "PartyA":"0791519433",
            "PartyB":"short code for lipa na mpesa online",
            "PhoneNumber":"0791519433",
            "CallBackURL":"http://197.248.86.122:801/stk_callback",
            "AccountReference":"//Customers Info",
            "TransactionDesc":"Process activation"


            }
        },
    
    function(error,response,body){
        if(error){
            console.log(error)
        }
        else{
            res.status(200).json(body)
        }
    }
    )
})


app.post('/stk_callback',(req,res)=>{
    console.log("......STK.......")
    console.log(req.body)
    /*console.log(req.body.Body.stkCallback.CallbackMetadata) */
})

//B2C (Sending Money To Customer i.e Paying Salary)
app.get('/b2c',access,(res,req)=>{
    let endpoint = ""
    let auth = "Bearer"+req.access_token

    request(
        {
            url=endpoint,
            method:"POST",
            headers:{
                "Authorization":auth
            },
            json:{
              "InitiatorName":"",
              "SecurityCredential":"",
              "CommandID":"",
              "Amount":"",
              "PartyA":"",
              "PartyB":"",
              "Remarks":"Salary for Dec",
              "QueueTimeoutURL":"http://your publicIP:801/b2c_timeout_url",
              "ResultURL":"http://your publicIP:801/b2c_response_url",
              "Occassion":"Salary Payment"
            }
        },
        function(error,response,body){
            if(error){
                console.log(error)
            }else{
                res.status(200).json(body)
            }
        }
        )
})


app.post('/b2c_timeout_url',(req,res)=>{
    console.log("......B2C TIMEOUT......")
    console.log(req.body)
})

app.post('/b2c_result_url',(req,res)=>{
    console.log("......B2C RESULT......")
    console.log(req.body.Result.ResultParameters)
})

function access(req,res,next){

    let url = ""
    let auth = new Buffer("").toString("base64")

    request({
     url:url,
     headers:{
         "Authorization":"Basic" + auth
     }
     ((error,response,body) =>{
        if(error){
            console.log(error)
        }
        else{
           //let res = 
           req.access_token = JSON.parse(body).access_token
        }
     })
    })
}

app.listen(80,(err,live)=>{
    if(err){
        console.log(err)
    }
    console.log('server started at port 80')
})

