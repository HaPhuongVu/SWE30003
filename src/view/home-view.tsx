import { Col, Container, Row } from 'react-bootstrap'
import { Card, CardContent, CardHeader } from '../components/card'
import Button from '../components/button'
import { useNavigate } from 'react-router'

export default function HomeView() {
  const navigate = useNavigate()
  return (
    <Container className='d-flex vh-100 justify-content-center align-items-center overflow-hidden'>
        <Row>
            <Col md={5}>
                <Card className='border-0 shadow-none'>
                    <CardHeader className='h3'>Premium Electronics for Modern Living</CardHeader>
                    <CardContent>
                        Discover cutting edge technology and premium electronic products designed to enhance your digital lifestyle. Quality meets innovation in every product we curate.
                        <div className='mt-3'>
                            <Button variant='destructive' onClick={() => {navigate('/catalogue')}}>Explore Collection</Button>
                        </div>
                    </CardContent>
                </Card>
            </Col>
            <Col className="ms-5 text-center" md={6}>
                <Row className='mb-3'>
                    <Col>
                    <Card className='p-4'>
                        <CardHeader>Latest Smartphone</CardHeader>
                        <CardContent>Premium devices with cutting edge features</CardContent>
                    </Card>
                    </Col>
                    <Col>
                    <Card className='p-4'>
                        <CardHeader>Pro Laptops</CardHeader>
                        <CardContent>High performance computing solutions</CardContent>
                    </Card>
                    </Col>
                </Row>
                <Row>
                <Col>
                    <Card className='p-4'>
                        <CardHeader>Audio Excellence</CardHeader>
                        <CardContent>Studio quality sound experince</CardContent>
                    </Card>
                    </Col>
                    <Col>
                    <Card className='p-4'>
                        <CardHeader>Smart Wearable</CardHeader>
                        <CardContent>Connected lifestyle technology</CardContent>
                    </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    </Container>
  )
}
