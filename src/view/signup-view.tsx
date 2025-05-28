import React from 'react'
import { FormLayout, FormControl, FormGroup, FormLabel } from '../components/form'
import { Container} from 'react-bootstrap'
import Button from '../components/button'

export default function SignupView() {
    return (
        <Container fluid className='d-flex flex-column vh-100 overflow-hidden bg-dark justify-content-center align-items-center'>
          <FormLayout className='w-50'>
          <h4 className='text-center fw-bolder'>Create Account</h4>
          <FormGroup>
            <FormLabel>Full Name</FormLabel>
            <FormControl type='text' placeholder='Enter your full name'></FormControl>
          </FormGroup>
          <FormGroup>
            <FormLabel>Email Address</FormLabel>
            <FormControl type='email' placeholder='Enter your email address'></FormControl>
          </FormGroup>
          <FormGroup>
            <FormLabel>Password</FormLabel>
            <FormControl type='password' placeholder='Create a password'></FormControl>
          </FormGroup>
          <FormGroup>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl type='password' placeholder='Confirm your password'></FormControl>
          </FormGroup>
          <Button type='submit' className='d-flex justify-content-center mx-auto' variant='destructive'>Create Account</Button>
          </FormLayout>
        </Container>
      )
}
