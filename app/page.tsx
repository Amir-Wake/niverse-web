"use client"

import Image from 'next/image';
import Img_constrruction from "@/public/img_construction.png";

export default function Home() {
  return (
    <div className='flex items-center justify-center min-h-screen py-5 bg-gray-100'>
      <title>Niverse</title>
        <Image
          src={Img_constrruction}
          alt="Under construction"
          layout="fill"
          objectFit="contain"
        />
    </div>
  );
}
