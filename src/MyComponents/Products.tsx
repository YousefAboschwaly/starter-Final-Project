import axios from "axios"
import { useEffect, useState } from "react"
import {Image} from "@nextui-org/image";
import {Card, CardHeader, CardBody}from "@nextui-org/card";

interface IProduct{
  id: string;
  imageCover:string;
  title:string;
  quantity:number;
  price:number
}

export default function Products() {

  
  const [products, setProducts] = useState<IProduct[]>([])

  // fetching Data
  useEffect(function(){

    async function getProducts() {
      try {
        const { data } = await axios.get(
          "https://ecommerce.routemisr.com/api/v1/products"
        );
        setProducts(data.data);
  
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    getProducts();

  },[])
  return (
    <>
  <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4  my-8 container">

  {products.map((product) => (


<Card className="py-4 product" key={product.id}>
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <p className="text-tiny uppercase font-bold">{product.title}</p>
            <small className="text-default-500">Quantity : {product.quantity}</small>
            <h4 className="font-bold text-large">Price : {product.price}$</h4>
          </CardHeader>
          <CardBody className="overflow-visible py-2 text-center">
            <Image
              className="object-cover rounded-xl w-full"
              src={product.imageCover}
              alt={product.title}
              
            />
          </CardBody>
        </Card>

      ))}
  </div>
    </>
  )
}
