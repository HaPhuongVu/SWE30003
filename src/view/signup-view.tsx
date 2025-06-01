import { FormLayout, FormControl, FormGroup, FormLabel } from '../components/form'
import { Container} from 'react-bootstrap'
import Button from '../components/button'
import React, { useState } from 'react'
import { accountAPI } from '../repository/account-repository'
import { useNavigate } from 'react-router'

export default function SignupView() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    try{
      const account = await accountAPI.create(name, email, username, password)
      if (account){
        localStorage.setItem('username', account.username)
        localStorage.setItem('userId', account.id)
        navigate('/')
        window.location.reload()
        alert('Successfully create account')
      }
    } catch(error){
      alert('Failed to create account. Try again.')
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Email Address</FormLabel>
            <FormControl
            type='email'
            placeholder='Enter your email address'
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Username</FormLabel>
            <FormControl
            type='text'
            placeholder='Enter your username'
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Password</FormLabel>
            <FormControl
            type='password'
            placeholder='Create a password'
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl
            type='password'
            placeholder='Confirm your password'/>
          </FormGroup>
          <Button type='submit' className='d-flex justify-content-center mx-auto' variant='destructive'>Create Account</Button>
        </FormLayout>
        </Container>
      )
}
