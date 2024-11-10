import React from "react";
import { Card } from "react-bootstrap";
import IMAGE1 from "../../img/image1.png";
import IMAGE2 from "../../img/image2.png";
import IMAGE3 from "../../img/image3.png";

const BottomRightComponent = () => {

  const hoverCards = [
    {
      title: "The Busby Centre",
      subTitle: "Upto 7% donated",
      imgSrc: "https://i.imgur.com/JGT9FfJ.png"
    },
    {
      title: "SoapForHope",
      subTitle: "Upto 3% donated",
      imgSrc: IMAGE2
    },
    {
      title: "Melanoma",
      subTitle: "Upto 8% donated",
      imgSrc: IMAGE3
    }
  ]

  return (
    <div className="position-fixed bottom-20 end-20">
      <div className="d-flex flex-col" style={{ gap: 4 }}>
        {
          hoverCards.map((hoverCard) => {
            return (
              <Card
                style={{ width: "210px", overflow: "hidden" }}
                className="m-0 p-0"
              >
                <Card.Body className="d-flex align-items-center">
                  <img
                    src={hoverCard.imgSrc}
                    alt="Card"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                  <div className="d-flex flex-column justify-content-center ml-2">
                    <div>{hoverCard.title}</div>
                    <div className="w-[126.60px] h-4 text-black text-[10px] font-light font-['Inter']">
                      {hoverCard.subTitle}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )
          })
        }
      </div>
    </div>
  );
};

export default BottomRightComponent;
