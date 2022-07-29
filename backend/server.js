const express = require("express");
const app=express();
const PORT=process.env.PORT | 3001;
const bodyParser = require('body-parser');
const Joi = require("joi");
const https = require("https");
const cors = require('./corsSetup');

let schedules=null;

//Handling CORS
app.use(cors);

// parse data into json for sending as response
app.use(bodyParser.json());

let url = "https://raw.githubusercontent.com/rohit-userfacet/userfacet-backend-testcase/main/teacher_availability.json";

https.get(url,(res) => {
    let body = "";

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            let json = JSON.parse(body);
            schedules=json;
        } catch (error) {
            console.error(error.message);
        };
    });

}).on("error", (error) => {
    console.error(error.message);
});

app.get('/',(req,res)=>{
    res.status(200).send("Hello");
});

app.post('/',(req,res)=>{
    try {
        const schema=Joi.object({
            full_name:Joi.string().required(),
            email_address:Joi.string().email().required(),
            weekday:Joi.string().required(),
            start_time:Joi.string().required(),
            end_time:Joi.string().required()
        });
        const {value:requestData,error}=schema.validate(req.body);
        if(!error){
            if(schedules!==null){
                
                let avails=schedules["availability"][requestData.weekday.toLowerCase()];
                let req_start_time=requestData.start_time.split(" ");
                let req_end_time=requestData.end_time.split(" ");

                let alloted=false;
                for (let i = 0; i < avails.length; i++) {
                    const  cur_avails= avails[i];
                    const cur_avails_ST=cur_avails.start_time.split(" ");
                    const cur_avails_ET=cur_avails.end_time.split(" ");

                    if( cur_avails_ST[1]==req_start_time[1] && cur_avails_ET[1]==req_end_time[1] &&
                        parseInt(cur_avails_ST[0])<=parseInt(req_start_time[0]) && 
                        parseInt(cur_avails_ET[0])>=parseInt(req_end_time[0])){
                            res.status(200).json({
                                "slot_confirmed": "true",
                                "weekday": requestData.weekday,
                                "start_time": requestData.start_time,
                                "end_time": requestData.end_time,
                                "date": "1 August 2022"
                            });
                            //Date is not handled (shortage of time)
                            alloted=true;
                            avails.splice(i,1);
                            break;
                    }
                }
                if(!alloted){
                    res.status(200).json(
                        {
                            "slot_confirmed": "false",
                            "reason": "teacher is not available on this day"
                        }
                    );
                }
            }
        }
        else    throw {message:error.message , statusCode:200};
    } catch (error) {
        console.log(error);
    }
});

app.use('*',(_,res)=>{
    res.json({
        message:"No routes matched."
    })
})

app.listen(PORT,()=>{
    console.log(`Server started.${PORT}`);
})