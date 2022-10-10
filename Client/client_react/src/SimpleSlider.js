import Slider from "react-slick";
import React, {useRef, useState, useEffect} from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './SimpleSlider.css';

function SimpleSlider() {
    const addr = "ws://localhost:5000";
    const [outputs, setOutputs] = useState([]);
    const [img, setImg] = useState([0, 1, 2]);
    const [socketConnected, setSocketConnected] = useState(false);

    let ws = useRef(null);

    const connectServer = () => {
        if(!ws.current){
            ws.current = new WebSocket(addr);
            ws.current.onopen = () => {
                console.log("connected to " + addr);
                setOutputs("connected to " + addr);
                setSocketConnected(true);
                ws.current.send(
                    JSON.stringify({
                        message: 0
                    })
                )
            };
            ws.current.onclose = (error) => {
                console.log("disconnect from " + addr);
                setOutputs("disconnect from " + addr)
                console.log(error);
            };
            ws.current.onerror = (error) => {
                console.log("connection error " + addr);
                setOutputs("connection error " + addr)
                console.log(error);
            };
            ws.current.onmessage = (evt) => {
                // server에서 보낸 데이터
                const data = JSON.parse(evt.data);
                console.log(data);
                setImg[0] = data[0];
                setImg[1] = data[1];
                setImg[2] = data[2];
                setOutputs((prevItems) => data);
            };
        };
    };
    useEffect(() => {
        connectServer();
    });
    const settings = {
        slide: 'div',
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dotsClass: "slick-dots slick-thumb"
    };
    return (
        <div>
            <Slider {...settings}>
                <div><img src={setImg[0]}/></div>
                <div><img src={setImg[1]}/></div>
                <div><img src={setImg[2]}/></div>
            </Slider>
            <div className="social">
                <p>작품선택<br/><button>GO</button></p>
                <p className="line">게시판<br/><button>GO</button></p>
                <p>기능<br/><button>GO</button></p>
            </div>
        </div>
    );
}


export default SimpleSlider