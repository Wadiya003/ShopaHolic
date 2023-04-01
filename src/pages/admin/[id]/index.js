import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Product from "@/models/Product";
import AddProduct from "@/components/AddProduct";
import { Menu } from "@headlessui/react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function editproduct({ product }) {
  const logoutClickHandler = () => {
    signOut({ callbackUrl: "/login" });
  };
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
    setRefresh(false);
  };
  useEffect(() => {
    setRefresh(true);
    refreshData();
  }, []);

  return (
    <>
      <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md">
            
            <Link href="/admin" className="text-lg font-bold">
              ShopaHolic
            </Link>

            <div>
              <Menu as="div" className="relative inline-block">
                <Menu.Button className="text-blue-600">Admin</Menu.Button>
                <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                 

                  <Menu.Item>
                    <Link
                      className="dropdown-link"
                      href="#"
                      onClick={logoutClickHandler}
                    >
                      Logout
                    </Link>
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          </nav>
        </header>
      {refresh ? <div>Loading</div> : <AddProduct
          formId="edit-product-form"
          productForm={product}
          forNewproduct={false}
        />}
    </>
  );
  /*  */
}

export async function getServerSideProps(context) {
  const id = context.query.id;
  const product = await Product.findById(id).lean();
  product._id = product._id.toString();
  product.createdAt = product.createdAt.toString();
  product.updatedAt = product.updatedAt.toString();
  return { props: { product } };
}
