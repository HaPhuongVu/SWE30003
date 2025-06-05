import { useQuery } from '@tanstack/react-query'
import { Col, Container, Row } from 'react-bootstrap'
import { CatalogueController } from '../controller/catalogue-controller'
import { ProductController } from '../controller/product-controller'
import { Card, CardContent, CardImage, CardHeader } from '../components/card'
import Button from '../components/button'
import { ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router'
import { CartController } from '../controller/cart-controller'
import { AccountController } from '../controller/account-controller'
import type { Catalogue } from '../models/catalogue'
import { NotificationController } from '../controller/notification-controller'

export default function CatalogueView() {
  const navigate = useNavigate()
  const {data, error, isLoading} = useQuery<Catalogue, Error>({
    queryKey: ['catalogue'],
    queryFn: () => CatalogueController.instance.getCatalogue()
  })

  const handleAddToCart = async (productId: string) => {
    const loggedInUser = AccountController.loggedInUser;
    if (!loggedInUser) {
      NotificationController.instance.update('Please login to add products to cart');
      return;
    }

    try {
      const product = await ProductController.instance.getProduct(productId);
      if (!product) {
        NotificationController.instance.update('Product not found');
        return;
      }
      const cart = await CartController.instance.getCart(loggedInUser);
      await CartController.instance.addProductToCart(cart, product, 1);
    } catch (error) {
      throw new Error (`Failed to add product to cart: ${error}`);
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
        {data?.items.map((catalogueItem) => (
          <Col className='col-4 mb-5'>
          <Card className='text-start'>
            <CardImage className='mx-auto w-50 h-50' src={catalogueItem.product.image} alt={catalogueItem.product.id}></CardImage>
            <CardHeader className='fs-5 border-0'>{catalogueItem.product.name}</CardHeader>
            <CardContent>
              <span>{catalogueItem.product.shortDescription}</span>
              <p className='mt-3 fw-bold text-dark'>${catalogueItem.product.price.toFixed(2)}</p>
              <p className='text-secondary'>Available left: {data?.getItemQuantity(catalogueItem.product)}</p>
              <Row>
                <Col>
                  <Button variant='destructive'
                  className="w-100"
                  onClick={() => navigate(`/product/${catalogueItem.product.id}`)}>
                    More Details
                  </Button>
                </Col>
                <Col>
                  <Button
                  variant='destructive'
                  className="w-100" onClick={() => handleAddToCart(catalogueItem.product.id)}>
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
