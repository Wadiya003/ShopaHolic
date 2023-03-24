//role based routing
import { getSession } from "next-auth/client";
import { NextResponse } from "next/server";
export default function middleware({ req }) {
  const session = getSession({ req });
  const user= session?.user;
  const role= user?.isAdmin? "admin" : "user";
  const url= req.url;
  if(role!=="admin"&& url.includes("admin"))
  return NextResponse.redirect("/");
  else if(role!=="user"&& (url.includes("/") || url.includes("cart") || url.includes("product")))
  return NextResponse.redirect("/admin");
  else return NextResponse.next();
}