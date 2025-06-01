import { Col, Container, Row } from 'react-bootstrap'
import { USERID, handleSubmit } from '../controller/account-controller'
import { Ellipsis, UserRound } from 'lucide-react'
import Button from '../components/button'
import { FormControl, FormLabel, FormLayout } from '../components/form'
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/table'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import type { Account } from '../models/account'
import { accountAPI } from '../repository/account-repository'
import { orderAPI } from '../repository/order-repository'
import type { Order } from '../models/order'

export default function AccountView() {
    const navigate = useNavigate()
    const {data: userData} = useQuery<Account, Error>({
        queryKey: ['account', USERID],
        queryFn: accountAPI.getById
    })

    const {data: orderData} = useQuery<Order[], Error>({
        queryKey: ['order', USERID],
        queryFn: orderAPI.get
    })

    const [dashboard, setDashboard] = useState(true)
    const [fullName, setFullName] = useState(userData?.fullname ?? "")
    const [password, setPassword] = useState(userData?.password ?? "")
    const [email, setEmail] = useState(userData?.email ?? "")
    const [username, setUsername] = useState(userData?.username ?? "")
    const [address, setAddress] = useState(userData?.address ?? "")
    const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber ?? "")

    useEffect(() => {
    if (userData) {
        setFullName(userData.fullname);
        setPassword(userData.password);
        setEmail(userData.email);
        setUsername(userData.username);
        setAddress(userData.address);
        setPhoneNumber(userData.phoneNumber);
    }
    }, [userData]);


  return (
    <Container className='d-flex vh-100 justify-content-start'>
        <Row className='w-100 mt-3'>
           <Col className='col-3 d-flex flex-column align-items-center border-end border-secondary-subtle'>
            <div className='border border-secondary rounded-circle overflow-hidden'>
                <UserRound width={150} height={150}/>
            </div>
            <h4 className='text-center text-capitalize fw-bold mt-3'>{userData?.fullname}</h4>
            <p className='text-secondary'>{userData?.email}</p>
            <Button
            className="w-100 mb-2"
            variant='destructive'
            onClick={() => setDashboard(true)}>
                Dashboard
            </Button>
            <Button
            className='w-100'
            onClick={() => setDashboard(false)}>
                Order Management
            </Button>
           </Col>
           <Col className='col-8 ms-3'>
           {dashboard ? (
            <>
           <h4 className='fw-bold'>Your information</h4>
            <FormLayout
            onSubmit={(e: React.FormEvent) => handleSubmit(
                e,
                userData!,
                fullName,
                email,
                username,
                password,
                address,
                phoneNumber)}>
            <Row>
            <Col className='col-6'>
                <FormLabel>Fullname</FormLabel>
                <FormControl
                value={fullName}
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                />
            </Col>
            <Col className='col-6'>
                <FormLabel>Email</FormLabel>
                <FormControl
                value={email}
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
            </Col>
            </Row>
            <Row className='mt-3'>
            <Col className='col-6'>
                <FormLabel>Username</FormLabel>
                <FormControl
                value={username}
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                />
            </Col>
            <Col className='col-6'>
                <FormLabel>Password</FormLabel>
                <FormControl
                value={password}
                type="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
            </Col>
            </Row>
            <Row className='mt-3'>
            <Col className='col-12'>
                <FormLabel>Address</FormLabel>
                <FormControl
                value={address}
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                />
            </Col>
            <Col className='col-12 mt-3'>
                <FormLabel>Contact number</FormLabel>
                <FormControl
                value={phoneNumber}
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                />
            </Col>
            </Row>
            <Button className='text-end mt-3' variant='destructive' type='submit'>Save changes</Button>
           </FormLayout>
           </>
           ) : (
            <>
            <h4 className='fw-bold'>Order Information</h4>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orderData?.map((order) => (
                        <TableRow>
                            <TableCell>#{order?.id}</TableCell>
                            <TableCell>{order?.orderDate.toLocaleString()}</TableCell>
                            <TableCell>{order?.status}</TableCell>
                            <TableCell>
                                <Button className='border-0' onClick={() => navigate(`/${order?.id}`)}>
                                <Ellipsis/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </>
           )}
           </Col>
        </Row>
    </Container>
  )
}
