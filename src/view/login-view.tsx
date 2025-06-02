import { FormLayout, FormControl, FormGroup, FormLabel } from '../components/form'
import { Container} from 'react-bootstrap'
import Button from '../components/button'
import { useState } from 'react'
import { AccountController } from '../controller/account-controller'
import { useNavigate } from 'react-router'

export default function LoginView() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
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
      setPassword('')
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>Password</FormLabel>
        <FormControl
        type='password'
        placeholder='Enter your password'
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
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
