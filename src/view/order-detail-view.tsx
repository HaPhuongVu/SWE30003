import { useQueries, useQuery } from '@tanstack/react-query'
import { Container } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router'
import { Order } from '../models/order'
import { orderAPI } from '../repository/order-repository'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/table'
import { productAPI } from '../repository/product-repository'
import { Account } from '../models/account'
import { accountAPI } from '../repository/account-repository'
import { USERID } from '../controller/account-controller'
import Button from '../components/button'
import { ArrowLeft } from 'lucide-react'

export default function OrderDetailView() {
  const navigate = useNavigate()
  const {orderId} = useParams<{orderId: string}>()
  if (!orderId) return null
  const {data: orderData, error, isLoading} = useQuery<Order, Error>({
    queryKey: ['order', orderId],
    queryFn: () => orderAPI.getById(orderId)
  })

  const productData = useQueries({
    queries: orderData?.items?.map(item => ({
      queryKey: ['product', item.productId],
      queryFn: () => productAPI.getById(item.productId)
    })) || []
  });

  const {data: userData} = useQuery<Account, Error>({
    queryKey: ['account'],
    queryFn: () => accountAPI.getById()
  })

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
            const product = productData[index]?.data
            return (
              <TableRow>
                <TableCell>{product?.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${((product?.price)! * item.quantity).toFixed(2)}</TableCell>
              </TableRow>
            )
          })}
          <TableRow className='fw-bold'>
            <TableCell colSpan={2}>Shipping Fee</TableCell>
            <TableCell>Free</TableCell>
          </TableRow>
          <TableRow className='fw-bold'>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell>${orderData?.totalBill.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className='mt-5'>
        <h4 className='fw-bold text-uppercase'>Customer Information</h4>
        <ul className='list-unstyled'>
          <li>Payment Method: {orderData?.payment}</li>
          <li>Shipping Method: {orderData?.shipment}</li>
          <li>Address: {userData?.address}</li>
          <li>Contact Number: {userData?.phoneNumber}</li>
        </ul>
      </div>
    </Container>
    </>
  )
}
