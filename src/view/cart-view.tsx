import { useQuery } from "@tanstack/react-query"
import { Col, Modal, Row } from "react-bootstrap"
import type { Cart } from "../models/cart"
import Button from "../components/button"
import { Trash } from "lucide-react"
import { CartController } from "../controller/cart-controller"
import { AccountController } from "../controller/account-controller"
import { useNavigate } from "react-router"

function CartView({open, onClose}:{open: boolean; onClose: () => void}) {
  const navigate = useNavigate()
  const loggedInUser = AccountController.loggedInUser;
  const {data: cart, error, isLoading, refetch} = useQuery<Cart, Error>({
    queryKey: ['cart', loggedInUser],
    queryFn: () => {
      return CartController.instance.getCart(loggedInUser!);
    },
    enabled: open && !!loggedInUser
  })

  const handleRemoveProduct = async (productId: string) => {
    if (!cart || !loggedInUser) return;

    try {
      const product = cart.items.find(item => item.product.id === productId)?.product;
      if (product) {
        await CartController.instance.removeProductInCart(cart, product);
        refetch();
      }
    } catch (error) {
      throw new Error (`Failed to remove product: ${error}`);
    }
  };

  if (isLoading) return <div>Loading...</div>
  if (error) throw error

  return (
    <>
      {loggedInUser ? (
        <Modal className="h-100" show={open} onHide={onClose}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold fs-4">Shopping Cart</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {cart?.items && cart.items.length > 0 ? (
              cart.items.map((item) => (
                <Row key={item.product.id} className="mb-3">
                  <Col className="col-4">
                    <img src={`/${item.product.image}`} className="w-100 h-100" alt={item.product.name} />
                  </Col>
                  <Col className="col-4 fw-bold text-secondary">
                    <p>{item.product.name}</p>
                    <p>${item.product.price.toFixed(2)} x {item.quantity}</p>
                  </Col>
                  <Col className="col-4 text-end">
                    <Button onClick={() => handleRemoveProduct(item.product.id)}>
                      <Trash />
                    </Button>
                  </Col>
                </Row>
              ))
            ) : (
              <p>Your cart is empty</p>
            )}

            {cart?.items && cart.items.length > 0 && (
              <Row className="mt-5 ms-4 fw-bold">
                <Col className="col-6">Total:</Col>
                <Col className="col-6">${CartController.instance.calculateTotal(cart).toFixed(2)}</Col>
                <Col className="col-6">Shipping:</Col>
                <Col className="col-6">Free</Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button className='w-50' onClick={onClose}>Continue Shopping</Button>
            {cart?.items && cart.items.length > 0 && (
              <Button variant="destructive" onClick={() => {navigate('/checkout');onClose()}}>Checkout</Button>
            )}
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