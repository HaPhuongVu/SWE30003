import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { FormControl, FormLayout, FormSelect } from "../components/form";
import { useQuery } from "@tanstack/react-query";
import type { Cart } from "../models/cart";
import { CartController } from "../controller/cart-controller";
import { AccountController } from "../controller/account-controller";
import Button from "../components/button";
import { useState, type FormEvent } from "react";
import { PaymentController } from "../controller/payment-controller";
import { OrderController } from "../controller/order-controller";
import { useNavigate } from "react-router";

export default function CheckOutView() {
  const navigate = useNavigate();
  const loggedInUser = AccountController.loggedInUser;
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [shipmentMethod, setShipmentMethod] = useState('Pickup')
  const [cardNumber, setCardNumber] = useState('')
  const [errors, setErrors] = useState('')
  const {data: cart, error, isLoading} = useQuery<Cart, Error>({
    queryKey: ['cart', loggedInUser],
    queryFn: () => {
      if (!loggedInUser) throw new Error('User not logged in');
      return CartController.instance.getCart(loggedInUser);
    }
  })
  if (isLoading) return <div>Loading...</div>
  if (error) throw error

  async function handleSubmit(e: FormEvent<Element>) {
    e.preventDefault();
    const cardData = {
      visaNumber: paymentMethod === "Visa" ? cardNumber : undefined,
      creditNumber: paymentMethod === "Credit Card" ? cardNumber : undefined,
      mastercardNumber: paymentMethod === "Mastercard" ? cardNumber : undefined
    }

    const newError = PaymentController.instance.validateForm(cardData)
    const errorMsg = newError.visaNumber || newError.creditNumber || newError.mastercardNumber || "";
    setErrors(errorMsg);
    if (errorMsg) return;
    try{
      const paymentDetails = {
        type: paymentMethod === "Cash" ? "cash" : "card",
        ...(paymentMethod !== "Cash" && {
          cardNumber,
          expiryDate: new Date().toISOString(),
          paymentGateway: "Tyro",
        }),
      }

      const shipmentDetails = {
        type: shipmentMethod.toLowerCase(),
        status: "Pending",
        address: shipmentMethod === "Delivery" ? address : undefined,
        partner: shipmentMethod === "Delivery" ? "Australia Post" : undefined,
        deliveryDate: shipmentMethod === "Delivery" ? new Date().toLocaleString('en') : undefined,
      }

      console.log("Payment Details:", paymentDetails);
      console.log("Shipment Details:", shipmentDetails);

      const storedOrder = await OrderController.instance.checkout(paymentDetails, shipmentDetails)
      alert("Order placed successfully!");
      navigate(`/${storedOrder.id}`);
    } catch (error) {
      alert (error)
    }
  }
  return (
    <Container className="mt-5 vh-100">
      <h2 className="fw-bold text-center">Checkout</h2>
      <Row>
        <Col className="col-6">
          <FormLayout onSubmit={handleSubmit}>
          <h4 className="fw-bold">Shipping Information</h4>
            <Col className="col-12 mt-3">
              <FormSelect onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setShipmentMethod(e.target.value)}>
                <option>Pickup</option>
                <option>Delivery</option>
              </FormSelect>
            </Col>
            {shipmentMethod !== 'Pickup' && (
               <Col className="col-12 mt-3">
               <FormControl
               type='text'
               placeholder='Enter your address'
               value={address}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}/>
               </Col>
            )}
            <Col className="col-12 mt-3">
            <FormControl type='text' placeholder='Contact number'/>
            </Col>
          <h4 className="fw-bold mt-4">Payment Details</h4>
            <Col className="col-12 mt-3">
              <FormSelect onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentMethod(e.target.value)}>
                <option>Cash</option>
                <option>Credit Card</option>
                <option>Visa</option>
                <option>Mastercard</option>
              </FormSelect>
            </Col>
            {paymentMethod !== 'Cash' && (
              <>
              <Col className="col-12 mt-3">
                <FormControl value={cardNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCardNumber(e.target.value)}
                placeholder='Card Number'/>
                {errors && <div className="text-danger mt-1">{errors}</div>}
              </Col>
              <Row>
              <Col className="col-6 mt-3">
                <FormControl placeholder='MM/YY'/>
              </Col>
              <Col className="col-6 mt-3">
                <FormControl placeholder='CVV'/>
              </Col>
              </Row>
              </>
            )}
          <Button type='submit' variant="destructive" className="w-100 mt-3">Complete Order</Button>
          <Button className="w-100 mt-3">Continue with shopping</Button>
          </FormLayout>
        </Col>
        <Col className="col-6 mt-3">
        <h4 className="fw-bold">Order</h4>
          <ListGroup className="w-75">
            {cart?.items.map((item) => (
              <ListGroup.Item className="d-flex justify-content-between">
                <span>{item.product.name} x {item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </ListGroup.Item>
            ))}
          <ListGroup.Item className="d-flex justify-content-between fw-bold">
            <span>Total</span>
            <span>${CartController.instance.calculateTotal(cart!).toFixed(2)}</span>
          </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  )
}
