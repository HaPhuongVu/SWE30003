import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from './button';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import CartView from '../view/cart-view';
import { AccountController } from '../controller/account-controller';
import { LogOut } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Account } from '../models/account';

function NavBar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const loggedInUser = AccountController.loggedInUser

  const {data: userData} = useQuery<Account | null, Error>({
    queryKey: ['account', loggedInUser],
    queryFn: async () => {
      if (!loggedInUser) return null
      const account = await AccountController.instance.getAccount(loggedInUser)
      return account
    },
    enabled: !!loggedInUser
  })

  const logout = () => {
    AccountController.loggedInUser = null
    navigate('/')
    window.location.reload()
  }
  return (
    <>
    <Navbar expand="lg" className="bg-body-tertiary" sticky='top'>
      <Container className="d-flex justify-content-between align-items-center small">
        <Navbar.Brand className="fs-5 fw-bolder" href="/">awe</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="d-flex justify-content-between w-75">
          <Nav className="d-flex align-items-center gap-3 fw-bold ms-4">
            <Nav.Link href='/'>Home</Nav.Link>
            <Nav.Link href='/category'>Categories</Nav.Link>
            <Nav.Link href='/catalogue'>Catalogue</Nav.Link>
            <Nav.Link href='/about'>About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="d-flex align-items-center gap-2 ms-auto w-25">
            <Button variant="destructive" onClick={() => setOpen(!open)}>Cart</Button>
            {userData ?
            (<>
            <Button onClick={()=> navigate('/account')}>{userData.username}</Button>
            <Button onClick={()=> logout()}><LogOut/></Button>
            </>):(<>
            <Button onClick={()=> navigate('/login')}>Login</Button>
            <Button onClick={()=> navigate('/signup')}>Sign Up</Button>
            </>)
            }
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <CartView open={open} onClose={() => setOpen(false)}/>
    </>
  );
}

export default NavBar;
