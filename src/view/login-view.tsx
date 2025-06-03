import { FormLayout, FormControl, FormGroup, FormLabel } from '../components/form'
import { Container} from 'react-bootstrap'
import Button from '../components/button'
import { useState } from 'react'
import { AccountController } from '../controller/account-controller'
import { useNavigate } from 'react-router'

// Validation functions
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export default function LoginView() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Validation error states
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  // Clear specific error when user starts typing
  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  // Validate individual fields
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'email':
        if (!value.trim()) return "Email is required";
        if (!validateEmail(value)) return "Please enter a valid email address";
        return "";
      case 'password':
        if (!value) return "Password is required";
        return "";
      default:
        return "";
    }
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors = {
      email: validateField('email', email),
      password: validateField('password', password)
    };

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === "");
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try{
      const account = await AccountController.instance.verifyAccount(email, password)
      if (account){
        AccountController.loggedInUser = account.id
        navigate('/')
        window.location.reload()
        alert('Login successfully')
      }
    } catch (error) {
      alert(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setEmail('')
      setPassword('')      // Clear errors after failed login
      setErrors({ email: "", password: "" });
    }
  }

  return (
    <Container fluid className='d-flex flex-column vh-100 overflow-hidden bg-dark justify-content-center align-items-center'>
      <FormLayout className='w-50 h-50' onSubmit={handleSubmit}>
      <h4 className='text-center fw-bolder'>Welcome Back</h4>
      <FormGroup>
        <FormLabel>Email Address</FormLabel>
        <FormControl
          type='email'
          placeholder='Enter your email'
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            clearError('email');
          }}
          className={errors.email ? 'border-danger' : ''}
        />
        {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
      </FormGroup>
      <FormGroup>
        <FormLabel>Password</FormLabel>
        <FormControl
          type='password'
          placeholder='Enter your password'
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
            clearError('password');
          }}
          className={errors.password ? 'border-danger' : ''}
        />
        {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
      </FormGroup>
      <Button
      type='submit'
      className='d-flex justify-content-center mx-auto'
      variant='destructive'>
        Sign In
      </Button>
      </FormLayout>
    </Container>
  )
}
