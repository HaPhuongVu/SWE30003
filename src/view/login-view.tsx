import { FormLayout, FormControl, FormGroup, FormLabel } from '../components/form'
import { Container} from 'react-bootstrap'
import Button from '../components/button'
import { useState } from 'react'
import { AccountController, type FormValidation } from '../controller/account-controller'
import { useNavigate } from 'react-router'

export default function LoginView() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Validation error states
  const [errors, setErrors] = useState<Partial<FormValidation>>({
    email: "",
    password: ""
  });
  const [formError, setFormError] = useState<string>("");

  // Clear specific error when user starts typing
  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: "" }));
    setFormError("");
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = AccountController.instance.validateForm({
      email: email,
      password: password
    });

    setErrors(newErrors);
    const isError = Object.values(newErrors).some(error => error !== "");

    if (isError) return;

    try{
      const account = await AccountController.instance.verifyAccount(email, password)
      if (account){
        AccountController.loggedInUser = account.id
        navigate('/')
        window.location.reload()
      }
    } catch (error) {
      setEmail('')
      setPassword('')
      setErrors({ email: "", password: "" });
      setFormError(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  return (
    <Container fluid className='d-flex flex-column vh-100 overflow-hidden bg-dark justify-content-center align-items-center'>
      <FormLayout className='w-50 h-50' onSubmit={handleSubmit}>
        <h4 className='text-center fw-bolder'>Welcome Back</h4>
        {formError && <div className="text-danger small mt-1 text-center">{formError}</div>}
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
