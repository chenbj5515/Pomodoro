'use client'
import { useRef } from 'react'
import "./infinite-scroll.css"
import { formatTime } from '@/utils';

const images = [
  {
    url: '/my-lady.jpeg',
    width: 756,
    height: 1208,
    containerWidth: 400 * 756 / 1208,
    containerHeight: 400
  },
  {
    url: "/wheat-field.jpeg",
    width: 1496,
    height: 1920,
    containerWidth: 400 * 1496 / 1920,
    containerHeight: 320
  },
  {
    url: '/snow.jpeg',
    width: 1200,
    height: 881,
    containerWidth: 400 * 1200 / 881,
    containerHeight: 400
  },
  {
    url: "/parasol.png",
    width: 500,
    height: 683,
    containerWidth: 400 * 500 / 683,
    containerHeight: 320
  },
  {
    url: "/Italy.png",
    width: 731,
    height: 736,
    containerWidth: 400 * 731 / 736,
    containerHeight: 400
  },
  {
    url: "/afternoon.jpeg",
    width: 1200,
    height: 1445,
    containerWidth: 400 * 1200 / 1445,
    containerHeight: 320
  },
  {
    url: "/water.jpeg",
    width: 1200,
    height: 907,
    containerWidth: 400 * 1200 / 907,
    containerHeight: 400
  },
  {
    url: "/forest.jpeg",
    width: 944,
    height: 1200,
    containerWidth: 400 * 944 / 1200,
    containerHeight: 320
  }
]

export const ArtworkViewer = (props: any) => {
  const { status, countdown } = props;
  const containerRef = useRef<HTMLDivElement>(null);

  const breakText = `Have a ${status === "short break" ? "short" : "long"} break`

  return (
    <div className="fixed w-full h-full overflow-auto font-NewYork">
      <div className='fixed left-[50%] -translate-x-1/2 text-center text-[24px] pt-[40px]'>{breakText}</div>
      <div
        className="inline-block -translate-x-1/2 left-[50%] text-center leading-[40px] rounded-md w-[100px] h-[40px] inset-0 fixed top-[100px] justify-center text-[32px] font-medium tabular-nums"
      >
        {formatTime(countdown)}
      </div>
      <div
        ref={containerRef}
        className='grid grid-flow-col items-center absolute top-[50%] h-[440px] w-[3200px]'
        style={{
          transform: "translateY(-50%)",
          padding: "20px 0px 20px 20px"
        }}
      >
        {images.map(({ url, containerWidth, containerHeight }, index) => (
          <div
            key={index}
            style={{
              width: containerWidth,
              height: containerHeight,
              transition: "opacity 0.5s ease"
            }}
            className='rounded-md leading-[600px]'
          >
            <img
              src={url}
              alt={`Image ${index}`}
              width={containerWidth}
              className='rounded-md'
              height={containerHeight}
            />
          </div>
        ))}
      </div>
    </div>
  );
};