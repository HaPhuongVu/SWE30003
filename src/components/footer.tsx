import { Mail, MapPinHouse, Phone } from 'lucide-react'
import { Col, Container, Row } from 'react-bootstrap'

function Footer() {
  return (
    <Container fluid className='bg-dark text-white small'>
        <Row className='my-2 pt-2 justify-content-center align-items-center'>
            <Col className='pe-5'>
            <h6 className='fw-bold'>AWE Electronics</h6>
            <p>Your trusted partner for premium electronic products.
            From our traditional store on Glenferrie Road to serving customers
            throughout Australia through our modern online platform.</p>
            </Col>
            <Col>
            <h6 className='fw-bold'>Get in Touch</h6>
            <ul className='list-unstyled'>
                <li><Mail/> hello@aweelec.com</li>
                <li><Phone/> (03) 1234 1234</li>
                <li><MapPinHouse/> Glenferrie Road, Melbourne</li>
            </ul>
            </Col>
        </Row>
        <Row className='border-top text-center py-2'>
            <Col>@ 2025 AWE Electronics. All rights served. Privacy Policy • Terms and Service</Col>
        </Row>
    </Container>
  )
}

export default Footer
