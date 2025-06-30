
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function ImageCarousel() {
  return (
    <div className="w-full h-[90vh]"> 
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={4000}
        showArrows={true}
        swipeable
        emulateTouch
        dynamicHeight={false}
      >
        <div>
          <img
            src="https://i.ytimg.com/vi/7Z5iP_emVGA/maxresdefault.jpg"
            alt="Banner 1"
            className="w-full h-[90vh] object-cover"
          />
        </div>
        <div>
          <img
            src="https://miro.medium.com/v2/resize:fit:1200/0*aDCHjBVFoKm7nvEN.jpg"
            alt="Banner 2"
            className="w-full h-[90vh] object-cover"
          />
        </div>
        <div>
          <img
            src="https://s.yimg.com/ny/api/res/1.2/npPccrJIGZqz1Yan6OrvUg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQyNw--/https://s.yimg.com/os/creatr-uploaded-images/2021-12/c25d3d60-68e6-11ec-aaf3-1ab9d3e3eb14"
            alt="Banner 3"
            className="w-full h-[90vh] object-cover"
          />
        </div>
      </Carousel>
    </div>
  );
}
