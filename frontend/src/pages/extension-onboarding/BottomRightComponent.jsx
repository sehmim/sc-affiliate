import React from 'react';
import { Card } from 'react-bootstrap';
import IMAGE1 from "./image1.png";
import IMAGE2 from "./image2.png";
import IMAGE3 from "./image3.png";


const BottomRightComponent = () => {
  return (
    <div className="position-fixed bottom-0 end-0">
      <div className="d-flex flex-col">
        <Card style={{ width: '184.827px', height: '54.97px' }} className="m-2">
          <Card.Body className="d-flex align-items-center">
            <img src={IMAGE1} alt="Card" style={{ width: '50px', height: '54.97px', objectFit: 'cover' }} />
            <div className="">
                <div>Title 2</div>
                <p>Description 2</p>
            </div>
          </Card.Body>
        </Card>
        <Card style={{ width: '184.827px', height: '54.97px' }} className="m-2">
          <Card.Body className="d-flex align-items-center">
            <img src={IMAGE2} alt="Card" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
            <div className="ms-3">
                <div>Title 2</div>
                <p>Description 2</p>
            </div>
          </Card.Body>
        </Card>
        <Card style={{ width: '184.827px', height: '54.97px' }} className="m-2">
          <Card.Body className="d-flex align-items-center">
            <img src={IMAGE3} alt="Card" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
            <div className="ms-3">
                <div>Title 2</div>
                <p>Description 2</p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default BottomRightComponent;
