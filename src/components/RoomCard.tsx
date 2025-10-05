"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Users, Bed, Baby, Hotel, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { t } from "i18next";

export type RoomCardProps = {
  id: number;
  name: string;
  image: string;
  size: string;
  priceText: string; // already formatted by parent (e.g. "22․000/գիշեր")
  beds: number;
  children: number;
  description?: string;
  shortDescription?: string;
  floor?: number;
  people?: number;
  onViewPath?: string; // defaults to `/room/${id}`
  className?: string;
};

const RoomCard: React.FC<RoomCardProps> = ({
  id,
  name,
  image,
  size,
  priceText,
  beds,
  children,
  description,
  floor,
  people,
  onViewPath,
  className = "",
}) => {
  const router = useRouter();

  return (
    <div
      className={`group relative bg-card rounded-2xl overflow-hidden shadow-lg md:hover:shadow-2xl transition-all duration-500 transform ${className}`}
    >
      {/* Room Image */}
      <div className='relative h-64 overflow-hidden'>
        <img
          src={image}
          alt={name}
          className='w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110'
        />

        {/* Hover Overlay */}
        <div className='absolute inset-0 bg-[rgba(255,69,0,0.41)] opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 text-white'>
          {/* Centered logo on hover */}
          <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
            <img
              src='/assets/logo/transparent-logo.png'
              alt='Syunik Logo'
              className='w-10 h-10 md:w-28 md:h-28 object-contain opacity-0 scale-75 mb-[50px] md:group-hover:opacity-100 md:group-hover:scale-100 transition-all duration-500 ease-out drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]'
              loading='lazy'
            />
          </div>
          <div className='transform translate-y-6 md:group-hover:translate-y-0 transition-transform duration-500'>
            <h3 className='text-xl font-bold mb-2'>{name}</h3>
            {/* {description && (
              <p className='text-sm mb-4 opacity-90'>{description}</p>
            )} */}

            <div className='flex items-center gap-4 text-sm'>
              <div className='flex items-center gap-1'>
                <span>{size}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Bed className='w-4 h-4' />
                <span>{beds}</span>
              </div>
              {typeof floor === "number" && (
                <div className='flex items-center gap-1'>
                  <Hotel className='w-4 h-4' />
                  <span>{floor}</span>
                </div>
              )}
              {typeof people === "number" && (
                <div className='flex items-center gap-1'>
                  <Users className='w-4 h-4' />
                  <span>{people}</span>
                </div>
              )}
              {(
                <div className='flex items-center gap-1'>
                  <Baby className='w-4 h-4' />
                  <span>{children}</span>
                </div>
              )}
            </div>

            {/* <div className='flex items-center justify-between mt-4'>
              <span className='text-1xl font-bold'>{priceText}</span>
            </div> */}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className='p-6'>
        <h3 className='text-xl font-semibold text-brand-text mb-2'>{name}</h3>
        {description && (
  <p className='text-brand-text/60 text-sm mb-4 leading-relaxed min-h-[130px]'>
    {description}
  </p>
)}
        
        <Button
          variant='outlineBrand'
          className='w-full rounded-[14px] group/button px-6 py-6'
          onClick={() => router.push(onViewPath || `/room/${id}`)}
        >
          {t("rooms.see_more")}
          <ArrowRight className='w-4 h-4 ml-1 group-hover/button:translate-x-1 transition-transform' />
        </Button>
      </div>
    </div>
  );
};

export default RoomCard;
