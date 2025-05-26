import React from 'react'
import { FormLayout, FormControl, FormGroup, FormLabel } from '../components/form'
import { Container} from 'react-bootstrap'
import Button from '../components/button'

export default function LoginView() {
  return (
    <Container fluid className='d-flex flex-column vh-100 overflow-hidden bg-dark justify-content-center align-items-center'>
      <FormLayout className='w-50 h-50'>
      <h4 className='text-center fw-bolder'>Welcome Back</h4>
      <FormGroup>
        <FormLabel>Email Address</FormLabel>
        <FormControl type='email' placeholder='Enter your email'></FormControl>
      </FormGroup>
      <FormGroup>
        <FormLabel>Password</FormLabel>
        <FormControl type='password' placeholder='Enter your password'></FormControl>
      </FormGroup>
      <Button type='submit' className='d-flex justify-content-center mx-auto' variant='destructive'>Sign In</Button>
      </FormLayout>
    </Container>
  )
}
