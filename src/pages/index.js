import Layout from '@/components/Layout'
import { Inter } from '@next/font/google'
import ProductItem from '@/components/ProductItem'
import Product from '@/models/Product';
import data from '@/utils/Data'
import { Store } from '@/utils/Store' 
import { useContext } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import DB from '@/utils/DB'
import Carousel from '@/components/Carousel';
const inter = Inter({ subsets: ['latin'] })

export default function Home({products}) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/product/${product._id}`);
    console.log("d")
    console.log(data);
    if (data.stock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Product added to the cart');
  };
  return (
    <>
    <Layout title={"Home"}>
    <Carousel images={data.carouselImages}/>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))}
      </div>
   
      
      </Layout>
    </>
  )
}



//get all data from mongodb before prerendering the page
export async function getServerSideProps(){
  await DB.connect();
  const products=await Product.find().lean(); //using lean we just get the products info instead of metadata from mongoose
  return{
    props:{
      products:products.map(DB.convertDoctoObj)
    }
  }
}