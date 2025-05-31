import { Col, Container, Row } from "react-bootstrap";
import { Card, CardContent, CardHeader, CardImage, CardFooter } from "../components/card";
import { useQuery } from "@tanstack/react-query";
import { categoryAPI } from "../repository/category-repository";
import type { Category } from "../models/category";
import Button from "../components/button";
import { useNavigate } from "react-router";

function CategoryView() {
  const navigate = useNavigate()
  const { data, error, isLoading } = useQuery<Category[], Error>({
    queryKey: ['category'],
    queryFn: categoryAPI.get
  });
  if(isLoading) return <div>Loading...</div>
  if(error) throw error
  return (
    <Container>
      <Row className="mt-5 mb-5">
        <Col className="col-12 text-center fw-bold">
        <h2>Shop by Category</h2>
        <p className="text-secondary">Explore our comprehensive range of premium electronic products across different categories</p>
        </Col>
      </Row>
      <Row className="text-center">
        {data?.map((category) => (
          <Col className="col-4 mb-5">
          <Card>
            <CardImage className="mx-auto w-25 h-25" src={category.image} alt={`${category.id} - ${category.name}`}/>
            <CardHeader>{category.name}</CardHeader>
            <CardContent>{category.description}</CardContent>
            <CardFooter>
              <Button variant="destructive"
              onClick={() => navigate(`/category/${category.id}`)}>
                Explore
              </Button>
            </CardFooter>
          </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default CategoryView