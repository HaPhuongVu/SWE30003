import { useQueries, useQuery } from "@tanstack/react-query"
import { Col, Modal, Row } from "react-bootstrap"
import { cartAPI } from "../repository/cart-repository"
import type { Cart } from "../models/cart"
import Button from "../components/button"
import { productAPI } from "../repository/product-repository"
import { Trash } from "lucide-react"
import { handleCheckout, removeProductInCart, totalCart } from "../controller/cart-controller"
import { USERID } from "../controller/account-controller"

function CartView({open, onClose}:{open: boolean; onClose: () => void}) {
  const {data: cartItems, error, isLoading} = useQuery<Cart[], Error>({
    queryKey: ['cart'],
    queryFn: () => cartAPI.getCart(),
    enabled: open
  })
 const productData = useQueries({
  queries: (cartItems ?? []).map(item => ({
    queryKey: ['product', item.productId],
    queryFn: () => productAPI.getById(item.productId)
  }))
 })

  if(isLoading) return <div>Loading...</div>
  if(error) throw error
  return (
    <>
    {!!USERID ? (
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
                <p>${product.data?.price.toFixed(2)} x {item?.quantity}</p>
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
          <Col className="col-6">${totalCart(cartItems!, productData)}</Col>
          <Col className="col-6">Shipping</Col>
          <Col className="col-6">Free</Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button className='w-50' onClick={onClose}>Continue Shopping</Button>
        <Button variant="destructive" onClick={()=>handleCheckout(cartItems!, productData!)}>Checkout</Button>
      </Modal.Footer>
    </Modal>
  ) : (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold fs-4">Shopping Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body>You need to login to view shopping cart</Modal.Body>
    </Modal>
  )}
  </>
  )
}

export default CartView