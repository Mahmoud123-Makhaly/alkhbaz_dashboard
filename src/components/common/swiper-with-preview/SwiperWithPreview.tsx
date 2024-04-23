'use client';

import { useState } from 'react';
import Image from 'next/image';
import SwiperCore from 'swiper';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

SwiperCore.use([FreeMode, Navigation, Thumbs]);

const SwiperWithPreview = ({ images }: { images: Array<string> }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  return (
    <div className="product-img-slider sticky-side-div">
      <Swiper
        navigation={true}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        className="swiper product-thumbnail-slider rounded bg-light"
      >
        <div className="swiper-wrapper text-center">
          {images.map(x => (
            <SwiperSlide key={9}>
              <Image
                src={x}
                alt=""
                className="img-fluid d-block"
                width={0}
                height={0}
                loading="lazy"
                sizes="100vw"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                }}
              />
            </SwiperSlide>
          ))}
        </div>
      </Swiper>

      <div className="product-nav-slider mt-2">
        <Swiper
          navigation={true}
          onSwiper={setThumbsSwiper}
          slidesPerView={10}
          watchSlidesProgress={true}
          spaceBetween={10}
          className="swiper prod-thumb-swiper product-nav-slider mt-2 overflow-hidden"
        >
          <div className="swiper-wrapper">
            {images.map(x => (
              <SwiperSlide key={9}>
                <Image
                  src={x}
                  alt=""
                  className="img-fluid d-block"
                  width={0}
                  height={0}
                  loading="lazy"
                  sizes="100vw"
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                />
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
      </div>
    </div>
  );
};
export default SwiperWithPreview;
