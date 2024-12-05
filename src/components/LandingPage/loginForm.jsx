import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import loginFormSchema from "@/lib/schema/loginFormSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from "@/components/ui/form";
import { getUser, isValidUser, getJWTtoken } from "@/lib/helper/dashboardUsersHelper";
import { useToast } from "@/hooks/use-toast";

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate({from: '/'});
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
        setLoading(true);
        const result = await isValidUser(data.username, data.password);
        if(!result.status) {
            if(result.code === 3) {
        
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: "Invalid creds, enter valid credentials",
                });
                return;
            }

            if(result.code === 5) {
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: "No user found, check your credentials",
                });
                return;
            }
            
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request. Try again later",
            });
            return;
        }

        const userDetails = await getUser(data.username);
        if(!userDetails.status) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: userDetails.message,
            });
            return;
        }

        const jwtData = {
            id: userDetails.data[0].id,
            username: userDetails.data[0].username,
            role: userDetails.data[0].role
        }

        const response_token = await getJWTtoken(jwtData);
        if(!response_token.status) {
            console.error("error:", response_token);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request. Try again later",
            });
            
            return;
        }

        localStorage.setItem("auth_token", response_token.data.token);

        //user successfully logged in. 
        navigate({to: "/dashboard", replace: true} );
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request. Try again later",
        });
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="form-wrapper">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <FormField 
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="text" placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="password" placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">SignIn</Button>
            </form>
        </Form>   
    </div>
  );
}
