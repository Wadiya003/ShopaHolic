//every request for signin and sign out and checkin authentication will be redirected to this file
import NextAuth from "next-auth/next";
import DB from "@/utils/DB";
import CredentialsProvider from 'next-auth/providers/credentials';
import User from "@/models/User";
import bcryptjs from "bcryptjs";
export default NextAuth({
    session:{
        strategy:'jwt',
    },
    //set token and session
    callbacks:{
        async jwt({token,user}){
            if(user?._id)token._id=user._id;
            if(user?.isAdmin)token.isAdmin=user.isAdmin;
            return token;
        },
        async session({session,token}){
            if(token?._id)session.user._id=token._id;
            if(token?.isAdmin)session.user.isAdmin=token.isAdmin;
            return session;
        }
    },
    //provider
    providers:[
        CredentialsProvider({
            async authorize(credentials){
                await DB.connect();
                const user= await User.findOne({
                    email:credentials.email,
                });
                console.log(user);
                await DB.disconnect();
                if(user && bcryptjs.compareSync(credentials.password,user.password)){
                    return{
                        _id:user._id,
                        name:user.name,
                        email:user.email,
                        isAdmin:user.isAdmin
                    };
                }
                // else{
                //     console.log(error);
                // }
                throw new Error("Invalid Email or Password")
            },
        }),
    ],
});