import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Store } from "@/utils/Store";
import { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { signOut, useSession } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import { Menu } from "@headlessui/react";
import DropdownLink from "./Dropdown";
import Cookies from "js-cookie";
import SearchIcon from "@heroicons/react/outline/SearchIcon"
export default function Layout({ title, children }) {
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  //client side render
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);
  //search query
  const [query, setQuery] = useState("");
  //search handler
  const searchHandler = (e) => {
    console.log(query);
    e.preventDefault();
    if (query) {
      // router.push(`/api/product?query=${query}`);
    } else {
      router.push("/");
    }
  };

  //logout
  const logoutClickHandler = () => {
    Cookies.remove('cart')
    dispatch({type:'CART_RESET'})
    signOut({callbackUrl:'/login'})
  };
  return (
    <>
      <Head>
        <title>{title ? title + " - ShopaHolic" : "ShopaHolic"}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="bottom-center" limit={1}></ToastContainer>
      <div className="flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md">
            <Link href="/" className="text-lg font-bold">
              ShopaHolic
            </Link>
            <form
              onSubmit={searchHandler}
              className="mx-auto hidden w-4/6 justify-center md:flex"
            >
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                className="rounded-tr-none rounded-br-none p-1 text-sm  w-4/6 "
                placeholder="Search products"
              />
              <button
                className="rounded rounded-tl-none rounded-bl-none bg-teal-400 p-1 text-sm dark:text-black"
                type="submit"
                id="button-addon2"
              >
                <SearchIcon className="h-5 w-5"></SearchIcon>
              </button>
            </form>
            <div>
              <Link href="/cart" className="p-2">
                Cart
                {cartItemsCount > 0 && (
                  <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {status === "loading" ? (
                "Loading"
              ) : session?.user ? (
                <Menu as="div" className="relative z-3 inline-block">
                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute z-50 right-0 w-56 origin-top-right bg-white  shadow-lg ">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="#"
                      >
                        Orders
                      </DropdownLink>
                    </Menu.Item>
                    {/* {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className="dropdown-link"
                          href="/admin/dashboard"
                        >
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )} */}
                    <Menu.Item>
                      <Link className="dropdown-link" href="#"
                      onClick={logoutClickHandler}>
                        Logout
                      </Link>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login" className="p-2">
                  Login
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Copyright © 2022 ShopaHolic</p>
        </footer>
      </div>
    </>
  );
}
