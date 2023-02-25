import Link from "next/link";
import React from "react";
// import Product from "@/models/Product";
import { useRouter } from "next/router";
import { useState } from "react";
export default function ManageProduct({ product }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  // console.log(product);
  const handleDelete = async (id) => {
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        body:JSON.stringify({id:id}),
      });
      console.log("Deleted");
      router.reload();
    } catch (error) {
      setMessage("Failed to delete the product.");
    }
  };
  return (
    <div className="card">
      <img
        src={product.image}
        alt={product.name}
        className="rounded shadow object-cover h-64 w-full"
      />

      <div className="flex flex-col items-center justify-center p-5">
        <h2 className="text-lg">{product.name}</h2>

        <p className="mb-2">{product.brand}</p>
        <p>${product.price}</p>
        <button className="primary-button" type="button" onClick={() => handleDelete(product._id)}>
          Delete
        </button>
        <button className="primary-button" type="button">
          Edit
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  await dbConnect();

  const product = await Product.findById(params.id).lean();
  product._id = product._id.toString();

  return { props: { product } };
}
