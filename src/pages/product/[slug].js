import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Layout from "@/components/Layout";
import { Store } from "@/utils/Store";
import DB from "@/utils/DB";
import Product from "@/models/Product";
import { Toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  //no admin access
  const { data: session } = useSession();
  const { redirect } = router.query;
  useEffect(() => {
    console.log(session?.user)
    if (session?.user) {
      if (session?.user?.isAdmin){
      //redirect to admin page
      //print error message
      router.push("/admin");
      }
    }
  }, [router, session, redirect]);

  if (!product) {
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }
  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.id === product.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/product/${product._id}`);
    if (data.stock < quantity) {
      return Toast.error("Sorry. Product is out of stock");
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/cart")
  };

  return (
    <Layout title={product.name}>
      
      <div className="grid md:grid-cols-4 md:gap-auto">
        <div className="md:col-span-2">
          <img
            className="rounded border h-fit md:w-5/6"
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
          ></img>
        </div>
        <div>
          <ul className="font-serif mt-0 mb-2 text-base font-extralight" >
            <li>
              <h1 className="font-serif mt-0 mb-2 text-5xl">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>Rating: {product.rating}</li>
            <li>Description: {product.description}</li>
          </ul>
          <button className="primary-button my-3">
        <Link href="/">Back to Home</Link>
        </button>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.stock > 0 ? "In stock" : "Unavailable"}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
          
        </div>
        
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await DB.connect();
  const product = await Product.findOne({ slug }).lean();
  console.log(product);
  await DB.disconnect();
  return {
    props: {
      product: product ? DB.convertDoctoObj(product) : null,
    },
  };
}
