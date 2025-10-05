"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoomCard from "@/components/RoomCard";
import FullScreenLoader from "@/components/FullScreenLoader";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatPrice } from "@/utils/numberUtils";
import { splitTitle } from "@/utils/textUtils";
import { resolveLang, pickLocalized } from "@/utils/i18nSupabase";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRooms } from "@/features/rooms/roomsSlice";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BackButton from "@/components/BackButton";

export default function RoomsPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const dispatch = useAppDispatch();
  const { items: rooms, loading, error } = useAppSelector((s) => s.rooms);

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const filteredRooms = rooms; // keep all for now

  // Light GSAP animations (lazy loaded)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import("gsap");
        if (cancelled) return;
        const gsapAny: any = (mod as any).gsap || (mod as any).default || mod;

        if (titleRef.current) {
          gsapAny.fromTo(
            titleRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          );
        }

        if (subtitleRef.current) {
          gsapAny.fromTo(
            subtitleRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.08 }
          );
        }

        const items = cardRefs.current.filter(Boolean);
        if (items.length) {
          gsapAny.fromTo(
            items,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.06 }
          );
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filteredRooms.length]);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "Free WiFi":
        return <Wifi className='w-4 h-4' />;
      case "Parking":
        return <Car className='w-4 h-4' />;
      case "Room Service":
        return <Coffee className='w-4 h-4' />;
      case "Gym Access":
        return <Dumbbell className='w-4 h-4' />;
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      {loading && <FullScreenLoader />}
      <Header forceWhite={true} />

      {/* Hero Section */}
      <section className='pt-28 pb-14 bg-gradient-to-b from-background to-background/60'>
        <div className='hotel-container'>
          <div className='mb-4'>
            <BackButton 
        onClick={() => router.push('/')} 
        label="Go Home" // Optional, you can omit this if you just want "Back"
      />
          </div>

          <div className='section-header'>
            <h1 ref={titleRef} className='text-4xl md:text-5xl section-header-text'>
              {(() => {
                const title = splitTitle(t("rooms.title", { defaultValue: "Մեր սենյակները" }));
                return title.hasTwoWords ? (
                  <>
                    {title.firstWord} <span className='accent-word'>{title.restWords}</span>
                  </>
                ) : (
                  title.firstWord
                );
              })()}
            </h1>
          </div>

          <p ref={subtitleRef} className='text-base md:text-lg text-brand-text/70 max-w-3xl mx-auto text-center'>
            {t("rooms.our_all_rooms", { defaultValue: "Ընտրեք մեր հոգատարությամբ ընտրված սենյակների և սյուտերի հավաքածուներից, որոնք ստեղծված են Ձեր հանգստի իդեալական փորձը ապահովելու համար" })}
          </p>
        </div>
      </section>

      {/* Rooms Grid */}
      <section>
        <div className='hotel-container'>
          {/* Desktop / Tablet Grid */}
          <div className='hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
            {error && (
              <div className='col-span-full text-center text-red-600 text-sm'>{error}</div>
            )}
            {!loading && !error && rooms.map((room, index) => {
              const lang = resolveLang(i18n.language);
              const name = pickLocalized(room as any, 'name', lang) || 'Room';
              const description = pickLocalized(room as any, 'description', lang) || '';
              const image = room.image_1 || room.image_2 || room.image_3 || room.image_4 || '';
              const sizeText = room.size ? `${room.size} m²` : '';
              const priceNumber = room.price_standard ?? undefined;
              const priceText = priceNumber !== undefined ? `${formatPrice(String(priceNumber), i18n.language)}/${t("common.night")}` : '';
              const childrenCapacity = (room as any).children_capacity ?? 0;
              return (
                <div
                  key={room.id}
                  ref={(el) => { if (el) cardRefs.current[index] = el; }}
                >
                  <RoomCard
                    id={room.id as any}
                    name={name}
                    image={image}
                    size={sizeText}
                    priceText={priceText}
                    beds={undefined as any}
                    children={childrenCapacity}
                    description={description}
                    onViewPath={`/room/${room.id}`}
                    floor={room.floor ?? undefined}
                    people={room.capacity ?? undefined}
                  />
                </div>
              );
            })}
          </div>

          {/* Mobile Carousel */}
          <div className='block md:hidden mb-12'>
            {loading && (
              <div className='text-center text-brand-text/70'>Loading...</div>
            )}
            {error && (
              <div className='text-center text-red-600 text-sm'>{error}</div>
            )}
            {!loading && !error && rooms.length > 0 && (
              <Carousel className='relative' opts={{ align: 'start', loop: true }}>
                <CarouselContent>
                  {rooms.map((room) => {
                    const lang = resolveLang(i18n.language);
                    const name = pickLocalized(room as any, 'name', lang) || 'Room';
                    const description = pickLocalized(room as any, 'description', lang) || '';
                    const image = room.image_1 || room.image_2 || room.image_3 || room.image_4 || '';
                    const sizeText = room.size ? `${room.size} m²` : '';
                    const priceNumber = room.price_standard ?? undefined;
                    const priceText = priceNumber !== undefined ? `${formatPrice(String(priceNumber), i18n.language)}/${t('common.night')}` : '';
                    const childrenCapacity = (room as any).children_capacity ?? 0;
                    return (
                      <CarouselItem key={room.id} className='basis-full'>
                        <RoomCard
                          id={room.id as any}
                          name={name}
                          image={image}
                          size={sizeText}
                          priceText={priceText}
                          beds={undefined as any}
                          children={childrenCapacity}
                          description={description}
                          floor={room.floor ?? undefined}
                          people={room.capacity ?? undefined}
                          onViewPath={`/room/${room.id}`}
                        />
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className='left-2 top-[calc(38%+10px)] -translate-y-1/2 h-12 w-12 rounded-full bg-[#ED5027] text-white shadow-md border-none active:opacity-90 active:scale-95 transition-transform [&_svg]:h-6 [&_svg]:w-6 hover:bg-[#ED5027]' />
                <CarouselNext className='right-2 top-[calc(38%+10px)] -translate-y-1/2 h-12 w-12 rounded-full bg-[#ED5027] text-white shadow-md border-none active:opacity-90 active:scale-95 transition-transform [&_svg]:h-6 [&_svg]:w-6 hover:bg-[#ED5027]' />
              </Carousel>
            )}
          </div>
        </div>
      </section>

      <div className='mt-20'>
        <Footer />
      </div>
    </div>
  );
}
