import React from "react";
import { Menu } from "@headlessui/react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import AddProduct from "@/components/AddProduct";
// import ManageProduct from '@/components/ManageProduct'
import Product from '@/models/Product';
import DB from '@/utils/DB'
import ManageProduct from "@/components/ManageProduct";
export default function Manage_Product({products}) {
  const logoutClickHandler = () => {
    signOut({ callbackUrl: "/login" });
  };
  const productForm = {
    name: '',
    slug: '',
    brand: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    rating: 0,
    image: '',
  }
  return (
    <div>
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
      <main>
        {/* add Product and show product */}
        <div class="p-5 block text-lg text-center	font-medium text-gray-800" > Add Product</div>
        <hr/>
        <AddProduct formId="add-poduct-form" productForm={productForm} forNewProduct={true}/>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ManageProduct
            product={product}
            key={product.slug}
          ></ManageProduct>
        ))}
      </div>
      </main>
      <footer className="flex h-10 justify-center items-center shadow-inner">
        <p>Copyright © 2022 ShopaHolic</p>
      </footer>
    </div>
  );
}
export async function getServerSideProps(){
  await DB.connect();
  const products=await Product.find().lean(); //using lean we just get the products info instead of metadata from mongoose
  return{
    props:{
      products:products.map(DB.convertDoctoObj)
    }
  }
}