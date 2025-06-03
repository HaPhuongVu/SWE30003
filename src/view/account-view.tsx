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

// Validation functions
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateFullName = (name: string): boolean => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name) && name.trim().length > 0 && name.trim().length <= 50;
};

const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[A-Za-z0-9]+$/;
    return usernameRegex.test(username) && username.length >= 8 && username.length <= 12;
};

const validatePassword = (password: string): boolean => {
    const hasAlpha = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    return password.length >= 8 && password.length <= 12 && hasAlpha && hasNumber && hasSpecialChar;
};

const validatePhoneNumber = (phone: string): boolean => {
    // Allow digits only
    const phoneRegex = /^[\d]+$/;
    return phoneRegex.test(phone) && phone.trim().length == 10;
};

const validateAddress = (address: string): boolean => {
    // Allow alphanumeric, comma, slash, and space
    const addressRegex = /^[A-Za-z0-9,/\s]+$/;
    return addressRegex.test(address) && address.trim().length > 0;
};

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
    });    const [dashboard, setDashboard] = useState(true)
    const [fullName, setFullName] = useState(userData?.fullname ?? "")
    const [password, setPassword] = useState(userData?.password ?? "")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [email, setEmail] = useState(userData?.email ?? "")
    const [username, setUsername] = useState(userData?.username ?? "")
    const [address, setAddress] = useState(userData?.address ?? "")
    const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber ?? "")    // Validation error states
    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        address: ""
    });

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

    // Clear specific error when user starts typing
    const clearError = (field: string) => {
        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    // Validate individual fields
    const validateField = (field: string, value: string): string => {
        switch (field) {
            case 'fullName':
                if (!value.trim()) return "Full name is required";
                if (!validateFullName(value)) return "Full name must contain only letters and spaces, max 50 characters";
                return "";
            case 'email':
                if (!value.trim()) return "Email is required";
                if (!validateEmail(value)) return "Please enter a valid email address";
                return "";
            case 'username':
                if (!value.trim()) return "Username is required";
                if (!validateUsername(value)) return "Username must be 8-12 characters, alphanumeric only";
                return "";
            case 'password':
                if (!value) return "Password is required";
                if (!validatePassword(value)) return "Password must be 8-12 characters with letters, numbers, and special characters";
                return "";
            case 'confirmPassword':
                if (!value) return "Password confirmation is required";
                if (value !== password) return "Passwords do not match";
                return "";
            case 'phoneNumber':
                if (value.trim() && !validatePhoneNumber(value)) return "Phone number must be 10 digits";
                return "";
            case 'address':
                if (value.trim() && !validateAddress(value)) return "Address must contain only letters, numbers, commas, slashes, and spaces";
                return "";
            default:
                return "";
        }
    };

    // Validate all fields
    const validateForm = (): boolean => {
        const newErrors = {
            fullName: validateField('fullName', fullName),
            email: validateField('email', email),
            username: validateField('username', username),
            password: validateField('password', password),
            confirmPassword: validateField('confirmPassword', confirmPassword),
            phoneNumber: validateField('phoneNumber', phoneNumber),
            address: validateField('address', address)
        };

        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === "");
    };

    function handleSubmit(e: FormEvent<Element>) {
        e.preventDefault();

        if (!userData) {
            alert('User data is not available.');
            return;
        }

        // Validate form before submission
        if (!validateForm()) {
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
            <FormLayout onSubmit={handleSubmit}>
                <Row>                <Col className='col-6'>
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
                </Col>                <Col className='col-6'>
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
                <Row className='mt-3'>                <Col className='col-6'>
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
                    <div className="text-muted small mt-1">8-12 characters, alphanumeric only</div>
                </Col>                <Col className='col-6'>
                    <FormLabel>Password</FormLabel>
                    <FormControl
                        value={password}
                        type="password"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setPassword(e.target.value);
                            clearError('password');
                            if (confirmPassword) clearError('confirmPassword'); // Clear confirm password error when password changes
                        }}
                        className={errors.password ? 'border-danger' : ''}
                    />
                    {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                    <div className="text-muted small mt-1">8-12 characters with letters, numbers, and special characters</div>
                </Col>                </Row>
                <Row className='mt-3'>
                <Col className='col-6'>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl
                        value={confirmPassword}
                        type="password"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setConfirmPassword(e.target.value);
                            clearError('confirmPassword');
                        }}
                        className={errors.confirmPassword ? 'border-danger' : ''}
                    />
                    {errors.confirmPassword && <div className="text-danger small mt-1">{errors.confirmPassword}</div>}
                </Col>
                <Col className='col-6'>
                    {/* Empty column for spacing */}
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
