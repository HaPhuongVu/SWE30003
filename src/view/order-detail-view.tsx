import { useQuery } from '@tanstack/react-query'
import { Container } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router'
import { Order } from '../models/order'
import { OrderController } from '../controller/order-controller'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/table'
import { Account } from '../models/account'
import { AccountController } from '../controller/account-controller'
import Button from '../components/button'
import { ArrowLeft } from 'lucide-react'

export default function OrderDetailView() {
  const navigate = useNavigate()
  const {orderId} = useParams<{orderId: string}>()
  const loggedInUser = AccountController.loggedInUser;
  const {data: orderData, error, isLoading} = useQuery<Order, Error>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const order = await OrderController.instance.getOrderById(orderId!)
      if (!order) throw new Error('Order not found')
        console.log(order)
      return order
    },
    enabled: !!orderId
  })

  const {data: userData} = useQuery<Account, Error>({
    queryKey: ['account', loggedInUser],
    queryFn: async () => {
      if (!loggedInUser) throw new Error('No logged in user')
      const account = await AccountController.instance.getAccount(loggedInUser)
      if (!account) throw new Error('Account not found')
      return account
    },
    enabled: !!loggedInUser
  })

  if (!orderId) return null

  if (isLoading) return <div>Loading...</div>
  if (error) throw error
  return (
    <>
    <Container fluid>
    <Button variant="destructive" onClick={()=>navigate(-1)}>
      <ArrowLeft/> Back
    </Button>
    </Container>
    <Container className='vh-100 mt-3'>
      <h1 className='fw-bold'>
        Order #{orderId}
      </h1>
      <span className='px-2 py-1 border rounded-pill bg-secondary'>{orderData?.status}</span>
      <span className='ms-2'>{orderData?.orderDate.toLocaleString()}</span>
      <Table className='mt-3'>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderData?.items.map((item, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{item.product?.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.product?.price && (item.product.price * item.quantity).toFixed(2)}</TableCell>
              </TableRow>
            )
          })}
          <TableRow className='fw-bold'>
            <TableCell colSpan={2}>Shipping Fee</TableCell>
            <TableCell>Free</TableCell>
          </TableRow>
          <TableRow className='fw-bold'>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell>${orderData?.getTotalPrice().toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className='mt-5'>
        <h4 className='fw-bold text-uppercase'>Customer Information</h4>
        <ul className='list-unstyled'>
          <li>Payment Method: {orderData?.payment?.constructor.name || 'N/A'}</li>
          <li>Shipping Method: {orderData?.shipment?.constructor.name || 'N/A'}</li>
          <li>Address: {userData?.address}</li>
          <li>Contact Number: {userData?.phoneNumber}</li>
        </ul>
      </div>
    </Container>
    </>
  )
}
