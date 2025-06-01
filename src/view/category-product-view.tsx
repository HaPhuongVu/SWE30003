import { useQuery } from '@tanstack/react-query'
import { Col, Container, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router'
import { Product } from '../models/product'
import { productAPI } from '../repository/product-repository'
import { Card, CardContent, CardImage, CardHeader } from '../components/card'
import Button from '../components/button'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { categoryAPI } from '../repository/category-repository'
import type { Category } from '../models/category'
import { addProductToCart } from '../controller/cart-controller'

function CategoryProductView() {
    const navigate = useNavigate()
    const {categoryId} = useParams<{categoryId: string}>()
    const {data: category} = useQuery<Category, Error>({
        queryKey: ['category', categoryId],
        queryFn: () => categoryAPI.getById(categoryId!)
    })
    const {data: products, isLoading, error} = useQuery<Product[], Error>({
        queryKey: ['product', categoryId],
        queryFn: () => productAPI.getByCategory(categoryId!)
    })
    if (isLoading) return <div>Loading...</div>
    if (error) throw error
  return (
    <>
    <Container className="position-absolute">
    <Button variant="destructive" onClick={()=>navigate("/category")}>
      <ArrowLeft/> Back
    </Button>
    </Container>
    <Container fluid>
        <Row>
            <Col className="col-12 text-center fw-bold">
            <h2>Featured Products</h2>
            <p className="text-secondary">All products belong to {category?.name}</p>
            </Col>
        </Row>
        <Row className='justify-content-center my-5'>
            {products?.map((product) => (
            <Col className='col-4 mb-5' key={product.id}>
                <Card className=''>
                    <CardImage className='mx-auto w-50 h-50' src={`/${product.image}`} alt={product.id}></CardImage>
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
                        className="w-100"
                        onClick={() => addProductToCart(product.id)}>
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
    </>
  )
}

export default CategoryProductView
