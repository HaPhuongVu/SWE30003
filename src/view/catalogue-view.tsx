import { useQuery } from '@tanstack/react-query'
import { Col, Container, Row } from 'react-bootstrap'
import { Product } from '../models/product'
import { CatalogueController } from '../controller/catalogue-controller'
import { ProductController } from '../controller/product-controller'
import { Card, CardContent, CardImage, CardHeader } from '../components/card'
import Button from '../components/button'
import { ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router'
import { CartController } from '../controller/cart-controller'
import { AccountController } from '../controller/account-controller'

export default function CatalogueView() {
  const navigate = useNavigate()
  const {data, error, isLoading} = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: () => CatalogueController.instance.getAllProducts()
  })

  const handleAddToCart = async (productId: string) => {
    const loggedInUser = AccountController.loggedInUser;
    if (!loggedInUser) {
      alert('Please login to add products to cart');
      return;
    }

    try {
      const product = await ProductController.instance.get(productId);
      if (!product) {
        alert('Product not found');
        return;
      }
      const cart = await CartController.instance.getCart(loggedInUser);
      await CartController.instance.addProductToCart(cart, product, 1);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  if(isLoading) return <div>Loading...</div>
  if(error) throw error
  return (
    <Container fluid>
      <Row className="mt-5 mb-5">
        <Col className="col-12 text-center fw-bold">
        <h2>Shopping Catalogue</h2>
        <p className="text-secondary">Explore our available products</p>
        </Col>
      </Row>
      <Row className='text-center'>
        {data?.map((product) => (
          <Col className='col-4 mb-5'>
          <Card className='text-start'>
            <CardImage className='mx-auto w-50 h-50' src={product.image} alt={product.id}></CardImage>
            <CardHeader className='fs-5 border-0'>{product.name}</CardHeader>
            <CardContent>
              {product.shortDescription}
              <p className='mt-3 fw-bold text-dark'>${product.price.toFixed(2)}</p>
              <Row>
                <Col>
                  <Button variant='destructive'
                  className="w-100"
                  onClick={() => navigate(`/product/${product.id}`)}>
                    More Details
                  </Button>
                </Col>
                <Col>
                  <Button
                  variant='destructive'
                  className="w-100" onClick={() => handleAddToCart(product.id)}>
                  <ShoppingCart/> Add to Cart
                  </Button>
                </Col>
              </Row>
            </CardContent>
          </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
