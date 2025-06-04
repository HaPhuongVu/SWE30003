import { FormLayout, FormControl, FormGroup, FormLabel } from '../components/form'
import { Container} from 'react-bootstrap'
import Button from '../components/button'
import React, { useState } from 'react'
import { AccountController } from '../controller/account-controller'
import { useNavigate } from 'react-router'


export default function SignupView() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string,string>>({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  // Clear specific error when user starts typing
  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: "" }));
  };


  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    const newError = AccountController.instance.validateForm(
      fullName,
      email,
      username,
      password,
      confirmPassword)
      setErrors(newError)
      const isValid = Object.values(newError).some(error => error !== "");
      if (isValid) return;

    try{
      const account = await AccountController.instance.createAccount(fullName, email, username, password, '', '')
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
            value={fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setFullName(e.target.value); clearError('fullName'); }}
            className={errors.fullName ? 'border-danger' : ''}
            />
            {errors.name && <div className="text-danger small mt-1">{errors.fullName}</div>}
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
              if (confirmPassword) clearError('confirmPassword');
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
