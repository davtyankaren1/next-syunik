"use client";

import { useTranslation } from "react-i18next";
import { splitTitle } from "@/utils/textUtils";
import Link from "next/link";

export const Reviews = () => {
  const { t } = useTranslation();

  return (
    <section
      id='reviews'
      className='relative pt-24 pb-24 md:pt-28 md:pb-28 lg:pt-32 lg:pb-32 lg:min-h-[100vh] bg-gradient-to-br from-background overflow-hidden'
    >
      <div className='hotel-container relative z-10'>
        {/* Section Header */}
        <div className='text-center mb-12 animate-fade-in'>
          <div className='section-header'>
            <h2 className='text-3xl md:text-4xl section-header-text'>
              {(() => {
                const title = splitTitle(t("reviews.title"));
                return title.hasTwoWords ? (
                  <>
                    {title.firstWord}{" "}
                    <span className='block md:inline accent-word'>
                      {title.restWords}
                    </span>
                  </>
                ) : (
                  title.firstWord
                );
              })()}
            </h2>
          </div>
          <p className='text-lg text-brand-text/70 max-w-2xl mx-auto mt-6'>
            {t("reviews.subtitle")}
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Booking */}
          <div className='bg-white rounded-2xl p-6 shadow-sm border border-border flex flex-col items-center text-center'>
            <img
              src='/assets/media-icons/booking-logo.png'
              alt='Booking.com'
              className='h-20 w-auto mb-4'
            />
            <h3 className='text-xl font-semibold mb-2'>Booking.com</h3>
            <p className='text-sm text-brand-text/70 mb-6'>
              {t("rooms.see_reviews")} Booking.com -ից
            </p>
            <Link
              href='/reviews#booking'
              className='inline-flex items-center justify-center rounded-md bg-[hsl(var(--brand-primary))] text-white px-4 py-2 text-sm font-medium shadow hover:opacity-90 transition'
            >
              {t("rooms.see_reviews")}
            </Link>
          </div>

          {/* Google */}
          <div className='bg-white rounded-2xl p-6 shadow-sm border border-border flex flex-col items-center text-center'>
            <img
              src='/assets/media-icons/google-logo.jpg'
              alt='Google'
              className='h-20 w-auto mb-4  rounded-3xl '
            />
            <h3 className='text-xl font-semibold mb-2'>Google</h3>
            <p className='text-sm text-brand-text/70 mb-6'>
              {t("rooms.see_reviews")} Google -ից
            </p>
            <Link
              href='/reviews#google'
              className='inline-flex items-center justify-center rounded-md bg-[hsl(var(--brand-primary))] text-white px-4 py-2 text-sm font-medium shadow hover:opacity-90 transition'
            >
              {t("rooms.see_reviews")}
            </Link>
          </div>

          {/* Yandex */}
          <div className='bg-white rounded-2xl p-6 shadow-sm border border-border flex flex-col items-center text-center'>
            <img
              src='/assets/media-icons/yandex-logo.png'
              alt='Yandex'
              className='h-20 w-auto mb-4  rounded-3xl '
            />
            <h3 className='text-xl font-semibold mb-2'>Yandex</h3>
            <p className='text-sm text-brand-text/70 mb-6'>
              {t("rooms.see_reviews")} Yandex -ից
            </p>
            <Link
              href='/reviews#yandex'
              className='inline-flex items-center justify-center rounded-md bg-[hsl(var(--brand-primary))] text-white px-4 py-2 text-sm font-medium shadow hover:opacity-90 transition'
            >
              {t("rooms.see_reviews")}
            </Link>
          </div>
        </div>

        <p className='text-center text-brand-text/70 max-w-3xl mx-auto mt-12'>
          {t("reviews.platform_intro")}
        </p>
      </div>
    </section>
  );
};
