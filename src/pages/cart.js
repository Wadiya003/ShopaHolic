import React, { useContext } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Link from "next/link";
import { XCircleIcon } from "@heroicons/react/outline";
import { Store } from "@/utils/Store";
import Image from "next/image";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function Cart() {

  const router = useRouter();
  const { data: session } = useSession();
  const { redirect } = router.query;

  useEffect(() => {
    console.log(session?.user)
    if (session?.user) {
      if (session?.user?.isAdmin){
      //redirect to admin page
      toast.error("Admins cannot access this page");
       router.push("/admin");
      }
    }
  }, [router, session, redirect]);

  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const removeItemHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };
  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty);
    const { data } = await axios.get(`/product/${item._id}`);
    if (data.stock < quantity) {
      return toast.error("Sorry. Product is out of stock");
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
    // toast.success('Product updated in the cart');
  };

  return (
    <Layout title="Shopping Cart">
      {cartItems.length === 0 ? (
        <>
          <div class="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
            <div class="relative">
              <div class="">
                <h1 class="my-2 text-gray-800 font-bold text-3xl">
                  Looks like there is nothing in cart.
                </h1>
                <p class="my-2 text-gray-800">
                  Please visit to the product page and select items to buy.
                </p>
                <Link href="/"  ><button class="primary-button">Go to Products</button>
                </Link>
              </div>
            </div>

            <div>
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-5521508-4610092.png" />
            </div>
          </div>
        </>
      ) : (
      <div>
        <div class="my-6 lg:my-12 container px-6 mx-auto flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-gray-300">
            <div>
                <h4 class="my-2 text-gray-800 font-bold text-3xl">Your Cart</h4>
            </div>
            <div class="mt-6 md:mt-0">
                <Link href="/"  ><button class="primary-button">Go Back</button>
                </Link>
            </div>
        </div>
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full ">
              <thead className="border-b">
                <tr>
                  <th className="p-5 text-left">Item</th>
                  <th className="p-5 text-right">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b">
                    <td>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          loader={() => item.image}
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        ></Image>
                        &nbsp;
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(item.stock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">${item.price}</td>
                    <td className="p-5 text-center">
                      <button onClick={() => removeItemHandler(item)}>
                        <XCircleIcon className="h-5 w-5"></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 text-xl">
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) : $
                  {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push("login?redirect=/shipping")}
                  className="primary-button w-full"
                >
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </div>
        </div>
      )}

    </Layout>
  );
}
//client side rendering
export default dynamic(() => Promise.resolve(Cart), { ssr: false });
