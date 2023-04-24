import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { getError } from "@/utils/Error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react"; 
import { useState } from "react";
import Cookies from "js-cookie";
export default function register() {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;
  const contentType = "application/json";
  useEffect(() => {
    console.log(session?.user);
    if (session?.user) {
      if (session?.user?.isAdmin) router.push("/admin");
      else router.push("/");
    }
  }, [router, session, redirect]);
  const [form, setForm] = useState({});
  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    // console.log(name, value);
    setForm({
      ...form,
      [name]: value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
    //  console.log("name");

          const res = await fetch("/api/user", {
            method: "POST",
            headers: {
              Accept: contentType,
              "Content-Type": contentType,
            },
            body: JSON.stringify({
              form
              }),
          });
          if (!res.ok) {
            throw new Error(res.status);
          }
          router.push('/login');
       
      // dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', data);
      // router.push(redirect || '/');
    } catch (err) {
      console.log(err);
      toast.error(getError(err));
    }
  };
  return (
    <Layout title={"Register"}>
      <div class="flex items-center min-h-screen p-4 lg:justify-center">
        <div class="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md">
          <div class="w-full flex md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
            <img
              class="w-full h-full lg:block  bg-cover rounded-l-lg"
              src="https://img.lovepik.com/free-png/20220127/lovepik-fashion-shopping-woman-shopping-bag-png-image_401910492_wh1200.png"
            />
          </div>

          <div class="p-5 bg-white md:flex-1">
            <h3 class="my-4 text-2xl font-semibold text-gray-700">
              Account Login
            </h3>
            <form class="px-8 pt-6 pb-8  mb-4 rounded" onSubmit= {submitHandler}>
              <div class="mb-4 md:flex  md:justify-between">
                <div class="mb-4 md:mr-2 md:mb-0">
                  <label
                    class="block mb-2 text-sm font-bold text-gray-700"
                    for="name"
                  >
                    Name
                  </label>
                  <input
                    class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    placeholder="Name"
                  //   {...register("name", {
                  //   required: "Please enter your Name.",
                  // })}
                  name="name"
                  value={form?.name}
                onChange={(e) => handleChange(e)}
                  />
                </div>
                <div class="md:ml-2">
                  <label
                    class="block mb-2 text-sm font-bold text-gray-700"
                    for="lastName"
                  >
                    Phone Number
                  </label>
                  <input
                    class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="phone"
                    type="number"
                    placeholder="Phone Number"
                    name="phone"
                    value={form?.phone}
                    onChange={(e) => handleChange(e)}
                  //   {...register("phone", {
                  //   required: "Please enter your Phone number.",
                  //   length: {
                  //     value: 10,
                  //     message: "Please enter valid contact number",
                  //   },
                  // })}
                  />
                </div>
              </div>
              <div class="mb-4">
                <label
                  class="block mb-2 text-sm font-bold text-gray-700"
                  for="email"
                >
                  Email
                </label>
                <input
                  class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  name="email"
                  value={form?.email}
                onChange={(e) => handleChange(e)}
                  // {...register("email", {
                  //   required: "Please enter your email",
                  //   pattern: {
                  //     value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  //     message: "Please enter valid email",
                  //   },
                  // })}
                  placeholder="Email"
                />
                 {/* {errors.email && (
                  <div className="text-red-500">{errors.email.message}</div>
                )} */}
              </div>
              <div class="mb-4 md:flex md:justify-between">
                <div class="mb-4 md:mr-2 md:mb-0">
                  <label
                    class="block mb-2 text-sm font-bold text-gray-700"
                    for="password"
                  >
                    Password
                  </label>
                  <input
                    class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    name="password"
                    value={form?.password}
                onChange={(e) => handleChange(e)}
                  // {...register("password", {
                  //   required: "Please enter a password",
                  //   minLength: {
                  //     value: 6,
                  //     message: "Password should be more than 5 chars",
                  //   },
                  // })}
                    placeholder="********"
                  />
                    {/* {errors.password && (
                  <div className="text-red-500 ">{errors.password.message}</div>
                )} */}
                 
                </div>
                <div class="md:ml-2">
                  <label
                    class="block mb-2 text-sm font-bold text-gray-700"
                    for="c_password"
                  >
                    Confirm Password
                  </label>
                  <input
                    class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="c_password"
                    type="password"
                    placeholder="*********"
                  />
                </div>
              </div>
              <div class="mb-6 text-center">
                <button
                  class="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-teal-400 rounded-md shadow hover:bg-teal-500 focus:outline-none focus:ring-teal-200 focus:ring-4"
                  type="submit"

                >
                  Register Account
                </button>
              </div>
              <hr class="mb-6 border-t" />
             
              <div class="text-center">
                <Link
                  class="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                  href="/login"
                >
                  Already have an account? Login!
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
