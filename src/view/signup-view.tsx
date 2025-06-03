import { FormLayout, FormControl, FormGroup, FormLabel } from '../components/form'
import { Container} from 'react-bootstrap'
import Button from '../components/button'
import React, { useState } from 'react'
import { AccountController } from '../controller/account-controller'
import { useNavigate } from 'react-router'

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

export default function SignupView() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Validation error states
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  // Clear specific error when user starts typing
  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  // Validate individual fields
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
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
      default:
        return "";
    }
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors = {
      name: validateField('name', name),
      email: validateField('email', email),
      username: validateField('username', username),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword)
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
      const account = await AccountController.instance.createAccount(name, email, username, password, '', '')
      if (account){
        AccountController.loggedInUser = account.id
        navigate('/')
        window.location.reload()
        alert('Successfully create account')
      }
    } catch (error) {
      alert(`Failed to create account. ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

    return (
        <Container fluid className='d-flex bg-dark justify-content-center align-items-center'>
        <FormLayout className='w-50 my-5' onSubmit={handleSubmit}>
          <h4 className='text-center fw-bolder'>Create Account</h4>
          <FormGroup>
            <FormLabel>Full Name</FormLabel>
            <FormControl
            type='text'
            placeholder='Enter your full name'
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value); clearError('name'); }}
            className={errors.name ? 'border-danger' : ''}
            />
            {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
            <div className="text-muted small mt-1">Letters and spaces only, max 50 characters</div>
          </FormGroup>
          <FormGroup>
            <FormLabel>Email Address</FormLabel>
            <FormControl
            type='email'
            placeholder='Enter your email address'
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); clearError('email'); }}
            className={errors.email ? 'border-danger' : ''}
            />
            {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
          </FormGroup>
          <FormGroup>
            <FormLabel>Username</FormLabel>
            <FormControl
            type='text'
            placeholder='Enter your username'
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUsername(e.target.value); clearError('username'); }}
            className={errors.username ? 'border-danger' : ''}
            />
            {errors.username && <div className="text-danger small mt-1">{errors.username}</div>}
            <div className="text-muted small mt-1">8-12 characters, alphanumeric only</div>
          </FormGroup>
          <FormGroup>
            <FormLabel>Password</FormLabel>
            <FormControl
            type='password'
            placeholder='Create a password'
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { 
              setPassword(e.target.value); 
              clearError('password'); 
              if (confirmPassword) clearError('confirmPassword'); // Clear confirm password error when password changes
            }}
            className={errors.password ? 'border-danger' : ''}
            />
            {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
            <div className="text-muted small mt-1">8-12 characters with letters, numbers, and special characters</div>
          </FormGroup>
          <FormGroup>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl
            type='password'
            placeholder='Confirm your password'
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
            className={errors.confirmPassword ? 'border-danger' : ''}
            />
            {errors.confirmPassword && <div className="text-danger small mt-1">{errors.confirmPassword}</div>}
          </FormGroup>
          <Button type='submit' className='d-flex justify-content-center mx-auto' variant='destructive'>Create Account</Button>
        </FormLayout>
        </Container>
      )
}
