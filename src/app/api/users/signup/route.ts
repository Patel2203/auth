import mongoose from "mongoose";
import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import{NextRequest, NextResponse} from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/helpers/mailer";

connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json()
        const {username, email, password} = reqBody
        
        console.log(reqBody);

        await User.findOne({email})

        if (User) {
            return NextResponse.json({error:"User already existed"},
                {status:400})
        }

        const salt = await bcryptjs.genSaltSync(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password:hashedPassword
        })
        
       const savedUser = await newUser.save()
       console.log(savedUser);

       await sendEmail({email, emailType:"VERIFY", userId:savedUser._id})

       return NextResponse.json({
        message:"User registered successfully",
        success:true,
        savedUser
       })
       
        
    } catch (error:any) {
        return NextResponse.json({error:error.message},
            {status:500})
        console.log();  
    }
}