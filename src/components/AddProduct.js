import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import axios from "axios";
const AddProduct = ({ formId, productForm, forNewProduct }) => {
  const router = useRouter();
  const contentType = "application/json";
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({});
  const [file, setFile] = useState();
  useEffect(() => {
    setForm({
      name: productForm.name,
      slug: productForm.slug,
      description: productForm.description,
      brand: productForm.brand,
      category: productForm.category,
      price: productForm.price,
      stock: productForm.stock,
      rating: productForm.rating,
      // image: "",
      //get the filename
      image: productForm.image,
    });
  }, []);
  //edit
  const putData = async (form) => {

    const id = productForm._id;
    // console.log(id);
    //edit image in cloudinary
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify({ id, ...form }),
      });
      console.log(res);
      // Throw error with status code in case Fetch API req failed
      if (!res?.ok) {
        throw new Error(res.status);
      }
      const { data } = await res.json();
      mutate(`/api/admin/products/${id}`, data, false); // Update the local data without a revalidation
      router.reload();
    } catch (error) {
      console.log(error);
      setMessage("Failed to update");
    }
  };
  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form) => {
    try {
      // form.image = form.image.replace("C:\\fakepath\\", "https://");
      // console.log("Hereee: " + form.image);
      const imageURL = await imageUpload(file);
      console.log(imageURL);
      form.image = await imageURL;
      console.log(form.image);
      const res = await fetch("/api/seed", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }
      router.reload();
    } catch (error) {
      setMessage("Failed to add product");
    }
    return res;
  };
  const imageUpload = async (imageFile) => {
    console.log("Img: " + imageFile);
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "Shopaholic_uploads");
    formData.append("cloud_name", "dpeauwce7");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dpeauwce7/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const res2 = await res.json();
    console.log(res2);
    return res2.url;
  };

  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    // console.log("i am e", e);
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
  };

  /* Makes sure product info is filled for product name, owner name, description, and imbrand url*/
  const formValidate = () => {
    let err = {};
    if (!form.name) err.name = "Name is required";
    if (!form.image) err.image = "Image is required";
    if (!form.slug) err.slug = "Slug is required";
    if (!form.description) err.description = "Description is required";
    if (!form.stock) err.stock = "Stock URL is required";
    if (!form.rating) err.rating = "Rating URL is required";
    if (!form.category) err.category = "Category URL is required";
    if (!form.brand) err.brand = "Brand is required";
    if (!form.price) err.price = "Price is required";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const errs = formValidate();
    // if (Object.keys(errs).length === 0) {
    //   forNewProduct ? postData(form) : postData(form);
    // } else {
    //   setErrors({ errs });
    // }
    const res = await postData(form);
    console.log(res);

    //set fields to empty
    setForm({
      name: "",
      slug: "",
      brand: "",
      description: "",
      category: "",
      price: 0,
      stock: 0,
      rating: 0,
      image: "",
    });
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="h-min grid grid-rows-1 grid-flow-col gap-4 p-5">
        <div className=" row-span-3 mt-5 mx:2">
          <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload photo
                </label>
                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-red-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 hover:text-red-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          accept="image/*"
                          name="image"
                          defaultValue={form?.image}
                          onChange={(e) => handleImageChange(e)}
                          type="file"
                          className="sr-only"
                        />
                      </label>
        {/* print image file if exist */}
                      {/* 
                      {form?.image && <img className="h-auto w-auto rounded-full" src={form.image} alt="img"></img>} */}
                      
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG or JPG/JPEG up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" mt-4 bg-gray-50 text-right">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
        </div>
        <div className="col-span-2  mt-5 mx:2">
          <div class="grid grid-cols-6 gap-6">
            <div class="col-span-6 sm:col-span-3">
              <label
                for="Product Name"
                class="block text-sm font-medium text-gray-700"
              >
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={form?.name}
                onChange={(e) => handleChange(e)}
                id="product-name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>

            <div class="col-span-6 sm:col-span-3">
              <label for="Slug" class="block text-sm font-medium text-gray-700">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={form?.slug}
                onChange={(e) => handleChange(e)}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label
                for="Brand"
                class="block text-sm font-medium text-gray-700"
              >
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={form?.brand}
                onChange={(e) => handleChange(e)}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>

            <div class="col-span-6 sm:col-span-3">
              <label
                for="Stock"
                class="block text-sm font-medium text-gray-700"
              >
                Stock
              </label>
              <input
                type="text"
                name="stock"
                value={form?.stock}
                onChange={(e) => handleChange(e)}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>

            <div class="col-span-6 sm:col-span-3">
              <label
                for="Rating"
                class="block text-sm font-medium text-gray-700"
              >
                Rating
              </label>
              <input
                type="text"
                name="rating"
                value={form?.rating}
                onChange={(e) => handleChange(e)}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>

            <div class="col-span-6 sm:col-span-3">
              <label
                for="Price"
                class="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="text"
                name="price"
                value={form?.price}
                onChange={(e) => handleChange(e)}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>

            <div class="col-span-6 sm:col-span-3">
              <label
                for="Category"
                class="block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <input
                type="text"
                name="category"
                value={form?.category}
                onChange={(e) => handleChange(e)}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label
                for="Description"
                class="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                placeholder="Description"
                name="description"
                value={form?.description}
                onChange={(e) => handleChange(e)}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        <p>{message}</p>
      </div>
    </form>
  );
};
export default AddProduct;
