//import { Card, Button } from "react-bootstrap";
import Link from "next/link";

const CardItem = (props) => {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img variant="top" src={props.image} />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{props.description}</Card.Text>
        <Button variant="primary">
          <Link href={props.link}>Show Details</Link>
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CardItem;
