import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { t } from "i18next";
import { useRouter } from "next/navigation";

export type BlogCardProps = {
  id: string;
  title: string;
  image: string;
  bullets: string[]; // concise bullet points (<= 150 chars combined preferred)
  onViewPath?: string;
  className?: string;
};

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  image,
  bullets,
  onViewPath,
  className = "",
}) => {
  const router = useRouter();

  return (
    <div className={`group relative bg-card rounded-2xl overflow-hidden shadow-lg md:hover:shadow-2xl transition-all duration-500 transform flex flex-col ${className}`}>
      {/* Image */}
      <div className='relative h-64 overflow-hidden'>
        <img
          src={image}
          alt={title}
          className='w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110'
        />

        {/* Hover Overlay (transparent orange) */}
        <div className='absolute inset-0 bg-[rgba(255,69,0,0.41)] opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 text-white'>
          {/* Centered logo on hover (same as RoomCard) */}
          <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
            <img
              src='/assets/logo/transparent-logo.png'
              alt='Syunik Logo'
              className='w-10 h-10 md:w-28 md:h-28 object-contain opacity-0 scale-75 mb-[50px] md:group-hover:opacity-100 md:group-hover:scale-100 transition-all duration-500 ease-out drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]'
              loading='lazy'
            />
          </div>
          <div className='transform translate-y-6 md:group-hover:translate-y-0 transition-transform duration-500'>
            <h3 className='text-xl font-bold mb-3'>{title}</h3>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className='p-6 flex-1 flex flex-col'>
        <h3 className='text-xl font-semibold text-brand-text mb-3 min-h-[56px] line-clamp-2'>{title}</h3>
        {bullets && bullets.length > 0 && (
          <div className='text-brand-text/70 text-sm mb-4 space-y-1 min-h-[84px]'>
            {bullets.map((b, i) => (
              <div key={i}>{b}</div>
            ))}
          </div>
        )}

        <Button
                  variant='outlineBrand'
                  className='w-full rounded-[14px] group/button px-6 py-6'
                  onClick={() => router.push(onViewPath || `/blog/${id}`)}
                >
                  {t('common.readBlog')}
                  <ArrowRight className='w-4 h-4 ml-1 group-hover/button:translate-x-1 transition-transform' />
                </Button>
      </div>
    </div>
  );
};

export default BlogCard;
