"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import Link from "next/link";
import React, {useEffect} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loginbtn from "../components/login"

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email:"",
        password:"",
    })

    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onLogin = async () => {
        try{
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success",response.data);
            alert("Login success");
            // router.push("/profile");
        }

        catch (error:any){
            console.log("Login failed",error.message);
            alert(error.message);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0)
        {
            setButtonDisabled(false);
        }
        else{
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            {/* <h1>{loading ? "Processing" : "Login"}</h1> */}
            <hr/>
            <Loginbtn/>
            
        </div>
    )
}

