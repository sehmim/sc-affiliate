import React from "react";
import { Card } from "react-bootstrap";
import IMAGE1 from "./image1.png";
import IMAGE2 from "./image2.png";
import IMAGE3 from "./image3.png";

const BottomRightComponent = () => {
  return (
    <div className="position-fixed bottom-20 end-20">
      <div className="d-flex flex-col" style={{ gap: 4 }}>
        <Card
          style={{ width: "184.827px", overflow: "hidden" }}
          className="m-0 p-0"
        >
          <Card.Body className="d-flex align-items-center">
            <img
              src={IMAGE1}
              alt="Card"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
            <div className="d-flex flex-column justify-content-center ml-2">
              <div>AISEC</div>
              <div className="w-[126.60px] h-4 text-black text-[10px] font-light font-['Inter']">
                Upto 0.07% donated
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card
          style={{ width: "184.827px", overflow: "hidden" }}
          className="m-0"
        >
          <Card.Body className="d-flex align-items-center">
            <img
              src={IMAGE2}
              alt="Card"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
            <div className="d-flex flex-column justify-content-center ml-2">
              <div>SoapForHope</div>
              <div className="w-[126.60px] h-4 text-black text-[10px] font-light font-['Inter']">
                Upto 0.03% donated
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card
          style={{ width: "184.827px", overflow: "hidden" }}
          className="m-0"
        >
          <Card.Body className="d-flex align-items-center">
            <img
              src={IMAGE3}
              alt="Card"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
            <div className="d-flex flex-column justify-content-center ml-2">
              <div>Melanoma</div>

              <div className="w-[126.60px] h-4 text-black text-[10px] font-light font-['Inter']">
                Upto 0.08% donated
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default BottomRightComponent;
