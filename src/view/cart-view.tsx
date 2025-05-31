import { useQueries, useQuery } from "@tanstack/react-query"
import { Col, Modal, Row } from "react-bootstrap"
import { cartAPI } from "../repository/cart-repository"
import type { Cart } from "../models/cart"
import Button from "../components/button"
import { productAPI } from "../repository/product-repository"
import { Trash } from "lucide-react"
import { removeProductInCart } from "../controller/cart-controller"

function CartView({open, onClose}:{open: boolean; onClose: () => void}) {
  const {data: cartItems, error, isLoading} = useQuery<Cart[], Error>({
    queryKey: ['cart'],
    queryFn: cartAPI.getCart,
    enabled: open
  })
 const productData = useQueries({
  queries: (cartItems ?? []).map(item => ({
    queryKey: ['product', item.productId],
    queryFn: () => productAPI.getById(item.productId)
  }))
 })

  const totalCart = () => {
    let total = 0;
    productData?.forEach((product) => {
      total += product.data?.price ?? 0;
    });
    return total.toFixed(2);
  }

  if(isLoading) return <div>Loading...</div>
  if(error) throw error
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold fs-4">Shopping Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {(cartItems ?? []).map((item, index) => {
          const product = productData[index]
          return (
            <Row key={item.id}>
              <Col className="col-4">
                <img src={`/${product.data?.image}`} className="w-100 h-100" />
              </Col>
              <Col className="col-4 fw-bold text-secondary">
                <p>{product.data?.name}</p>
                <p>${product.data?.price.toFixed(2)}</p>
              </Col>
              <Col className="col-4 text-end">
                <Button onClick={() => removeProductInCart(item.id)}>
                  <Trash />
                </Button>
              </Col>
            </Row>
          )
        })}
        <Row className="mt-5 ms-4 fw-bold">
          <Col className="col-6">Total:</Col>
          <Col className="col-6">${totalCart()}</Col>
          <Col className="col-6">Shipping</Col>
          <Col className="col-6">Free</Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button className='w-50' onClick={onClose}>Continue Shopping</Button>
        <Button variant="destructive">Checkout</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CartView