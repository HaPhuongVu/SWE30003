import { Col, Container, Row } from 'react-bootstrap'
import { Download, Ellipsis, EyeClosed, UserRound } from 'lucide-react'
import Button from '../components/button'
import { FormControl, FormLabel, FormLayout } from '../components/form'
import { useEffect, useState, type FormEvent } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/table'
import { useNavigate } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Account } from '../models/account'
import { OrderController } from '../controller/order-controller'
import { AccountController, type FormValidation } from '../controller/account-controller'
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
            setFormError('Account updated successfully!');
        },
        onError: (error: Error) => {
            setFormError(`Failed to update account: ${error.message}`);
        }
    });

    const [dashboard, setDashboard] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [fullName, setFullName] = useState(userData?.fullname ?? "")
    const [password, setPassword] = useState(userData?.password ?? "")
    const [email, setEmail] = useState(userData?.email ?? "")
    const [username, setUsername] = useState(userData?.username ?? "")
    const [address, setAddress] = useState(userData?.address ?? "")
    const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber ?? "")
    const [errors, setErrors] = useState<FormValidation>({
        fullName: "",
        email: "",
        username: "",
        password: "",
        phoneNumber: "",
        address: ""
    });
    const [formError, setFormError] = useState<string>("");

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

    const clearError = (field: string) => {
        setErrors(prev => ({ ...prev, [field]: "" }));
        setFormError("");
    };


    function handleSubmit(e: FormEvent<Element>) {
        e.preventDefault();

        if (!userData) {
            setFormError('User data is not available.');
            return;
        }

        const newError = AccountController.instance.validateForm({
            fullName: fullName,
            email: email,
            username: username,
            password: password,
            phoneNumber: phoneNumber,
            address: address
        });

        setErrors(newError);
        const isError = Object.values(newError).some(error => error !== "");
        if (isError) return;

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
        window.location.reload();
    }

  return (
    <Container className='d-flex vh-100 justify-content-start'>
        <Row className='w-100 mt-4'>
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
            {formError && <div className="text-danger small mt-1 text-center">{formError}</div>}
            <FormLayout onSubmit={handleSubmit}>
                <Row>
                <Col className='col-6'>
                    <FormLabel>Fullname</FormLabel>
                    <FormControl
                        value={fullName}
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFullName(e.target.value);
                            clearError('fullName');
                        }}
                        className={errors.fullName ? 'border-danger' : ''}
                    />
                    {errors.fullName && <div className="text-danger small mt-1">{errors.fullName}</div>}
                </Col>
                <Col className='col-6'>
                    <FormLabel>Email</FormLabel>
                    <FormControl
                        value={email}
                        type="email"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setEmail(e.target.value);
                            clearError('email');
                        }}
                        className={errors.email ? 'border-danger' : ''}
                    />
                    {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                </Col>
                </Row>
                <Row className='mt-3'>
                <Col className='col-6'>
                    <FormLabel>Username</FormLabel>
                    <FormControl
                        value={username}
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setUsername(e.target.value);
                            clearError('username');
                        }}
                        className={errors.username ? 'border-danger' : ''}
                    />
                    {errors.username && <div className="text-danger small mt-1">{errors.username}</div>}
                </Col>
                <Col className='col-6'>
                    <FormLabel>
                        Password
                    <Button
                    className='ms-2 my-0 border-0'
                    size='icon'
                    onClick={() => setShowPassword(!showPassword)}>
                        <EyeClosed/>
                    </Button>
                    </FormLabel>
                    <FormControl
                        value={password}
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setPassword(e.target.value);
                            clearError('password');
                        }}
                        className={errors.password ? 'border-danger' : ''}
                    />
                    {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                </Col>
                </Row>
                <Row className='mt-3'>
                <Col className='col-12'>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl
                    value={address}
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAddress(e.target.value);
                        clearError('address');
                    }}
                    className={errors.address ? 'border-danger' : ''}
                    />
                    {errors.address && <div className="text-danger small mt-1">{errors.address}</div>}
                    <div className="text-muted small mt-1">Optional - Letters, numbers, commas, slashes, and spaces only</div>
                </Col>
                <Col className='col-12 mt-3'>
                    <FormLabel>Contact number (Optional)</FormLabel>
                    <FormControl
                    value={phoneNumber}
                    type="tel"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setPhoneNumber(e.target.value);
                        clearError('phoneNumber');
                    }}
                    className={errors.phoneNumber ? 'border-danger' : ''}
                    />
                    {errors.phoneNumber && <div className="text-danger small mt-1">{errors.phoneNumber}</div>}
                    <div className="text-muted small mt-1">Optional - 10 digits only</div>
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
                            <TableHead>Receipt</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {orderData && orderData.length > 0 ? (
                        orderData.map((order) => (
                        <TableRow key={order?.id}>
                            <TableCell>#{order?.id}</TableCell>
                            <TableCell>{new Date(order?.orderDate).toLocaleDateString()}</TableCell>
                            <TableCell>{order?.status}</TableCell>
                            <TableCell>
                            <Button className="border-0" onClick={() => navigate(`/${order?.id}`)}>
                                <Ellipsis />
                            </Button>
                            </TableCell>
                            <TableCell>
                            <Button className="border-0" onClick={() => OrderController.instance.generateReceipt(order)}>
                                <Download />
                            </Button>
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted">
                            No order has been placed yet.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </>
            )}
            </Col>
        </Row>
    </Container>
  )
}
