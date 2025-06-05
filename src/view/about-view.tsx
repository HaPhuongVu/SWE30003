import { Col, Container, Row } from 'react-bootstrap'
import { Card, CardContent, CardHeader, CardImage } from '../components/card'
import { ShieldUser, UserRound } from 'lucide-react'

function AboutView() {
  return (
    <Container>
        <h1 className='fw-bold text-center'>About awe</h1>
        <p className='fw-bold text-secondary text-center'>Premium electronics for modern living </p>
        <Row className='my-5'>
          <Col className='col-12'>
          <Card className='w-100 fw-bold'>
            <CardHeader className='fs-2'>Who are we?</CardHeader>
            <CardContent>
              awe is dedicated to creating premium electronic products that enhance your digital lifestyle.
              We believe in combining cutting-edge technology with elegant design to deliver exceptional user experiences
            </CardContent>
            <CardContent>
              Our mission is to make premium technology accessible to everyone.
              We partner with top brands like Apple, Samsung, and Sony to offer authentic products at competitive prices, backed by exceptional customer service.
            </CardContent>
            <CardContent>
              Whether you're looking for the latest iPhone, a powerful gaming console, or professional-grade headphones, we're here to help you find the perfect tech for your lifestyle.
            </CardContent>
          </Card>
          </Col>
        </Row>
        <Row className='my-5 text-center'>
          <Col className='col-12'>
            <h1 className='fw-bold'>Our Values</h1>
          </Col>
          <Col className='col-4'>
            <Card>
              <h4 className='fs-4 text-dark fw-bold px-5 pt-4'>Authenticity</h4>
              <CardContent className='px-5'>We guarantee genuine products from authorized retailers and manufacturers.</CardContent>
            </Card>
          </Col>
          <Col className='col-4'>
          <Card>
              <h4 className='fs-4 text-dark fw-bold px-5 pt-4'>Selection</h4>
              <CardContent className='px-5'>Carefully curated collection of the best electronics from top brands.</CardContent>
            </Card>
          </Col>
          <Col className='col-4'>
          <Card>
              <h4 className='fs-4 text-dark fw-bold px-5 pt-4'>Service</h4>
              <CardContent className='px-5'>Expert support to help you choose the right technology for your needs.</CardContent>
            </Card>
          </Col>
        </Row>
        <Row className='my-5 text-center'>
          <Col className='col-12'>
            <h1 className='fw-bold'>Our Teams</h1>
          </Col>
          <Col className='col-4'>
            <Card>
              <ShieldUser className='w-50 h-50 mx-auto pt-2'/>
              <CardHeader className='fs-4'>Vu Ha Phuong</CardHeader>
              <CardContent className='fw-bold'>Store Manager</CardContent>
            </Card>
          </Col>
          <Col className='col-4'>
            <Card>
              <UserRound className='w-50 h-50 mx-auto pt-2'/>
              <CardHeader className='fs-4'>Jaanane Catherine </CardHeader>
              <CardContent className='fw-bold'>Customer Service</CardContent>
            </Card>
          </Col>
          <Col className='col-4'>
            <Card>
              <UserRound className='w-50 h-50 mx-auto pt-2'/>
              <CardHeader className='fs-4'>Khang Vo</CardHeader>
              <CardContent className='fw-bold'>Sales Advisor</CardContent>
            </Card>
          </Col>
        </Row>
    </Container>
  )
}

export default AboutView