import { FormLayout, FormControl, FormGroup, FormLabel } from '../components/form'
import { Container} from 'react-bootstrap'
import Button from '../components/button'
import React, { useState } from 'react'
import { AccountController, type FormValidation } from '../controller/account-controller'
import { useNavigate } from 'react-router'


export default function SignupView() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FormValidation>({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: ""
  });
  const [formError, setFormError] = useState<string>("");

  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: "" }));
    setFormError("");
  };


  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()

    const newError = AccountController.instance.validateForm({
      fullName: fullName,
      email: email,
      username: username,
      password: password,
      confirmPassword: confirmPassword
    });
    setErrors(newError);

    const isError = Object.values(newError).some(error => error !== "");
    if (isError) return;

    try{
      const account = await AccountController.instance.createAccount(fullName, email, username, password, '', '')
      if (account){
        AccountController.loggedInUser = account.id
        navigate('/')
        window.location.reload()
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unknown error');
    }
  }

    return (
        <Container fluid className='d-flex bg-dark justify-content-center align-items-center'>
        <FormLayout className='w-50 my-5' onSubmit={handleSubmit}>
          <h3 className='text-center fw-bolder'>Create Account</h3>
            {formError && <div className="text-danger small mt-1 text-center">{formError}</div>}
          <FormGroup>
            <FormLabel>
              Full Name
            <span className="text-muted small ms-2">(Letters and spaces only, max 50 characters)</span>
            </FormLabel>
            <FormControl
            type='text'
            placeholder='Enter your full name'
            value={fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setFullName(e.target.value); clearError('fullName'); }}
            className={errors.fullName ? 'border-danger' : ''}
            />
            {errors.fullName && <div className="text-danger small mt-1">{errors.fullName}</div>}
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
            <FormLabel>
              Username
            <span className="text-muted small ms-2">(8-12 characters, alphanumeric only)</span>
            </FormLabel>
            <FormControl
            type='text'
            placeholder='Enter your username'
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUsername(e.target.value); clearError('username'); }}
            className={errors.username ? 'border-danger' : ''}
            />
            {errors.username && <div className="text-danger small mt-1">{errors.username}</div>}
          </FormGroup>
          <FormGroup>
            <FormLabel>
              Password
            <span className="text-muted small ms-2">(8-12 characters with letters, numbers, and special characters)</span>
            </FormLabel>
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
