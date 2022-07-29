import React,{useState} from 'react'
import {Form,FormBody,FormBoxEnd,FormDropDown,FormErrorMessage,FormInput,FormInputField,FormLabel} from '../styles/FormStyles.js'
import { Formik } from "formik";
import * as Yup from 'yup';
import axios from '../constants/axios';

function BookSlot() {
    const [resultMessage,setResultMessage]=useState({message:"",type:""});
    const weekdays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    const initialValues = {
        full_name:"",
        email_address: "",
        weekday: "",
        start_time:"",
        end_time:""
    };
    
    const validateSchema = Yup.object().shape({
        full_name: Yup.string().required("Full Name is required"),
        email_address: Yup.string().required("Email is required"),
        weekday: Yup.string().required("Weekday is required"),
        start_time: Yup.string().required("Start Time is required"),
        end_time: Yup.string().required("End Time is required")
    });

    const submitForm = async (reqData) => {
        try {
            for (const prop in reqData) {
                if(reqData[prop]==="") reqData[prop]=null;
            }
            const response = await axios.post(
              '/',
              JSON.stringify(reqData),
              {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              }
            );
            console.log(response.data);
            setResultMessage({message:JSON.stringify(JSON.parse(response.data)),type:"good"});
        } catch (err) {
            if (!err?.response) {
                setResultMessage({message:"No Server Response",type:"bad"});
            } else {
                setResultMessage({message:"Error Occurred",type:"bad"});
            }
        }
    };

    return(
       <Formik
        initialValues={initialValues}
        validationSchema={validateSchema}
        onSubmit={submitForm}
        >
           {
               ({values,handleChange,handleSubmit,errors,touched})=>{
                return(
                    <Form onSubmit={handleSubmit}>
                        <FormBody>
                            {resultMessage.message!=="" && <FormErrorMessage type={resultMessage.type}>{resultMessage.message}</FormErrorMessage> }
                            <FormInputField>
                                <FormLabel htmlFor="full_name">Full Name </FormLabel>
                                <FormInput type="text" id="full_name" name="full_name" value={values.full_name} onChange={handleChange} error={touched.full_name && errors.full_name} placeholder="Full Name"/>
                            </FormInputField>
                                {touched.full_name && errors.full_name && <FormErrorMessage type="bad">{errors.full_name}</FormErrorMessage>}
                            <FormInputField>
                                <FormLabel htmlFor="email_address">Email </FormLabel>
                                <FormInput  type="email" id="email_address" name="email_address" value={values.email_address} onChange={handleChange} error={touched.email_address && errors.email_address} placeholder="Email"/>
                            </FormInputField>
                                {touched.email_address && errors.email_address && <FormErrorMessage type="bad">{errors.email_address}</FormErrorMessage>}
                            <FormInputField>
                                <FormLabel htmlFor="weekday">Weekday</FormLabel>
                                <FormDropDown id="weekday" name="weekday" value={values.weekday} onChange={handleChange} error={touched.weekday && errors.weekday}>
                                    {
                                        weekdays.map((days)=>{
                                            return (
                                                <option key={days} value={days}>{days}</option>
                                            );
                                        })
                                    }
                                </FormDropDown>
                            </FormInputField>
                                {touched.weekday && errors.weekday && <FormErrorMessage type="bad">{errors.weekday}</FormErrorMessage>}
                            <FormInputField>
                                <FormLabel htmlFor="start_time">Start Time </FormLabel>
                                <FormInput  id="start_time" name="start_time" value={values.start_time} onChange={handleChange} error={touched.start_time && errors.start_time} placeholder="Start Time(Ex.-9 AM)"/>
                            </FormInputField>
                                {touched.start_time && errors.start_time && <FormErrorMessage type="bad">{errors.start_time}</FormErrorMessage>}
                            <FormInputField>
                                <FormLabel htmlFor="end_time">End Time </FormLabel>
                                <FormInput  id="end_time" name="end_time" value={values.end_time} onChange={handleChange} error={touched.end_time && errors.end_time} placeholder="End Time(Ex.-10 AM)"/>
                            </FormInputField>
                                {touched.end_time && errors.end_time && <FormErrorMessage type="bad">{errors.end_time}</FormErrorMessage>}
                        </FormBody>
                        <FormBoxEnd>
                            <button type="submit">Book Slot</button>
                        </FormBoxEnd>
                    </Form>
                );
               }
           }
       </Formik>
    )       
}

export default BookSlot