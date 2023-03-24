import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Product from "@/models/Product";
import AddProduct from "@/components/AddProduct";

export default function editproduct({ product }) {
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
