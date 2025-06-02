import { useQuery } from "@tanstack/react-query";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { ProductController } from "../controller/product-controller";
import type { Product } from "../models/product";
import Button from "../components/button";
import { ArrowLeft, Check, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { CartController } from "../controller/cart-controller";
import { AccountController } from "../controller/account-controller";

function ProductDetailView() {
  const navigate = useNavigate()
  const [value, setValue] = useState<number>(1)
  const {productId} = useParams<{productId: string}>()
  const {data, isLoading, error} = useQuery<Product, Error>({
    queryKey: ['product', productId],
    queryFn: async () => {
      const product = await ProductController.instance.get(productId!)
      if (!product) throw new Error('Product not found')
      return product
    }
  })

  const handleAddToCart = async (quantity: number) => {
    const loggedInUser = AccountController.loggedInUser;
    if (!loggedInUser) {
      alert('Please login to add products to cart');
      return;
    }

    if (!productId || !data) {
      alert('Product not found');
      return;
    }

    try {
      const cart = await CartController.instance.getCart(loggedInUser);
      await CartController.instance.addProductToCart(cart, data, quantity);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  if (isLoading) return <div>Loading...</div>
  if (error) throw error

  const increaseValue = () => {
    setValue((prev) => prev+1)
  }

  const decreaseValue = () => {
    setValue((prev) => (prev > 0 ? prev-1 : 0))
  }
  return (
    <>
    <Container className="position-absolute">
    <Button variant="destructive" onClick={()=>navigate(-1)}>
      <ArrowLeft/> Back
    </Button>
    </Container>
    <Container className="d-flex flex-column vh-100 justify-content-center align-items-center overflow-hidden">
        <Row>
            <Col><img src={`/${data?.image}`} className="w-100 h-100"/></Col>
            <Col className="col-5 fw-bold">
            <div className="fs-2 mb-3">{data?.name}</div>
            <div className="fs-3 mb-2">${data?.price.toFixed(2)}</div>
            <p className="text-secondary small">{data?.longDescription}</p>
            <div className="fs-5 mb-4">
              Quantity:
              <span className="ms-3">
              <Button size="small" onClick={decreaseValue}>
                <Minus/>
              </Button>
              <input className="w-25 mx-1 text-center small" value={value} readOnly></input>
              <Button size="small" onClick={increaseValue}>
                <Plus/>
              </Button>
              </span>
            </div>
            <div className="mt-3">
            <ul className="list-unstyled">
              <li><Check/> Free Shipping</li>
              <li><Check/> 2 - Year Warranty</li>
              <li><Check/> 30 Days Return</li>
            </ul>
            </div>
            <Button
            className="w-100"
            variant="destructive"
            onClick={() => handleAddToCart(value)}
            >
             <Plus/> Add to Cart
            </Button>
            </Col>
        </Row>
    </Container>
    </>
  )
}

export default ProductDetailView
