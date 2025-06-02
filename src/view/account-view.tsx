import { Col, Container, Row } from 'react-bootstrap'
import { Ellipsis, UserRound } from 'lucide-react'
import Button from '../components/button'
import { FormControl, FormLabel, FormLayout } from '../components/form'
import { useEffect, useState, type FormEvent } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/table'
import { useNavigate } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import type { Account } from '../models/account'
import { OrderController } from '../controller/order-controller'
import { AccountController } from '../controller/account-controller'
import type { Order } from '../models/order'

export default function AccountView() {
    const navigate = useNavigate()
    const {data: userData} = useQuery<Account, Error>({
        queryKey: ['account', AccountController.loggedInUser],
        queryFn: () => {
            if (!AccountController.loggedInUser) {
                navigate('/login')
                return Promise.reject(new Error('User not logged in'))
            }
            return AccountController.instance.getAccount(AccountController.loggedInUser);
        }
    })

    const {data: orderData} = useQuery<Order[], Error>({
        queryKey: ['order', AccountController.loggedInUser],
        queryFn: () => {
            if (!AccountController.loggedInUser) {
                navigate('/login')
                return Promise.reject(new Error('User not logged in'))
            }
            return OrderController.instance.getOrdersByUser(AccountController.loggedInUser)
        }
    })

    const updateAccountMutation = useMutation({
        mutationFn: (updatedAccount: Account) => AccountController.instance.updateAccount(
            updatedAccount.id,
            updatedAccount.fullname,
            updatedAccount.email,
            updatedAccount.username,
            updatedAccount.password,
            updatedAccount.address ?? "",
            updatedAccount.phoneNumber ?? ""
        ),
        onSuccess: () => {
            alert('Account updated successfully!');
        },
        onError: (error: Error) => {
            alert(`Failed to update account: ${error.message}`);
        }
    });

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
        setAddress(userData.address ?? "");
        setPhoneNumber(userData.phoneNumber ?? "");
    }
    }, [userData]);


    function handleSubmit(e: FormEvent<Element>, userData: Account, fullName: string, email: string, username: string, password: string, address: string, phoneNumber: string) {
        e.preventDefault();
        if (!userData) {
            alert('User data is not available.');
            return;
        }

        const updatedAccount: Account = {
            ...userData,
            fullname: fullName,
            email: email,
            username: username,
            password: password,
            address: address,
            phoneNumber: phoneNumber
        };

        updateAccountMutation.mutate(updatedAccount);
    }

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
