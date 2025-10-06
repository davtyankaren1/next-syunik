"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Bed,
  Baby,
  Ruler,
  Layers,
  Calendar,
  Star,
  Users,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { resolveLang, pickLocalized } from "@/utils/i18nSupabase";
import FullScreenLoader from "@/components/FullScreenLoader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRoomById } from "@/features/roomDetail/roomDetailSlice";
import { t } from "i18next";
import { formatPrice } from "@/utils/numberUtils";
import RoomCard from "@/components/RoomCard";
import { fetchRooms } from "@/features/rooms/roomsSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CommentForm from "@/components/CommentForm";
import CommentsList from "@/components/CommentsList";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import BackButton from "@/components/BackButton";

export default function RoomDetailPage() {
  const { roomId } = useParams<{ roomId: string }>() ?? {
    roomId: undefined as unknown as string
  };
  const router = useRouter();
  const { i18n } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useAppDispatch();
  const { data: room, loading, error } = useAppSelector((s) => s.roomDetail);
  const { items: rooms, loading: roomsLoading } = useAppSelector(
    (s) => s.rooms
  );

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const fetchedIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (roomId && fetchedIdRef.current !== roomId) {
      fetchedIdRef.current = roomId;
      dispatch(fetchRoomById(roomId));
    }
  }, [dispatch, roomId]);

  // Ensure rooms list is available for related section
  useEffect(() => {
    if (!rooms || rooms.length === 0) {
      dispatch(fetchRooms());
    }
  }, [dispatch, rooms?.length]);

  const images: string[] = [
    room?.image_1,
    room?.image_2,
    room?.image_3,
    room?.image_4
  ].filter(Boolean) as string[];

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % Math.max(images.length, 1));
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1)
    );

  // Auto-slide
  useEffect(() => {
    const timer = setTimeout(() => nextImage(), 5000);
    return () => clearTimeout(timer);
  }, [currentImageIndex]);

  // GSAP entrance
  useEffect(() => {
    if (loading || !room) return;
    const ctx = gsap.context(() => {
      gsap.from(".rd-image", {
        opacity: 0,
        scale: 0.98,
        duration: 0.6,
        ease: "power2.out"
      });
      gsap.from([".rd-stagger"], {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.1
      });
      gsap.from(".rd-thumb", {
        opacity: 0,
        y: 8,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.06,
        delay: 0.2
      });
    });
    return () => ctx.revert();
  }, [loading, room]);

  const relatedRooms = useMemo(() => {
    const list = rooms || [];
    const currentId = room?.id;
    const filtered = list.filter((r) => String(r.id) !== String(currentId));
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [rooms, room?.id]);

  // While loading or when room is still null without an error (e.g., first load/refresh), show loader
  if (loading || (!room && !error)) {
    return <FullScreenLoader />;
  }

  // If there's an error, show an error page
  if (error) {
    return (
      <div className='min-h-screen bg-background'>
        <Header forceWhite={true} />
        <section className='pt-28'>
          <div className='hotel-container text-red-600'>{error}</div>
        </section>
        <Footer />
      </div>
    );
  }

  // TypeScript narrowing: at this point we expect room to be present; if not, keep showing loader
  if (!room) {
    return <FullScreenLoader />;
  }

  const lang = resolveLang(i18n.language);
  const name = pickLocalized(room as any, "name", lang) || "";
  const description = pickLocalized(room as any, "description", lang) || "";

  return (
    <div className='min-h-screen bg-background'>
      <Header forceWhite={true} />

      {/* Hero Section */}
      <section className='pt-28 bg-gradient-to-br from-brand-accent to-background'>
        <div className='hotel-container'>
          {/* <Button
            onClick={() => router.push("/rooms")}
            className='mb-6 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-brand-text shadow-sm transition-all duration-300 hover:bg-brand-primary hover:text-white hover:shadow-md'
          >
            <ArrowLeft className='w-4 h-4' />
            {t("nav.back_button")}
          </Button> */}
          <BackButton
            onClick={() => router.push("/rooms")}
            label='Go Home' // Optional, you can omit this if you just want "Back"
          />
        </div>
      </section>

      {/* Gallery and details */}
      <section>
        <div className='hotel-container'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6'>
            {/* Image Gallery */}
            <div className='space-y-6'>
              <div className='relative h-96 rounded-2xl overflow-hidden'>
                <div className='w-full h-full overflow-hidden'>
                  <div
                    className='flex w-full h-full transition-transform duration-500 ease-out rd-image'
                    style={{
                      transform: `translateX(-${currentImageIndex * 100}%)`
                    }}
                  >
                    {images.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`${name} - Image ${i + 1}`}
                        className='w-full h-full object-cover flex-shrink-0'
                        style={{ width: "100%" }}
                      />
                    ))}
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10'
                >
                  <ChevronLeft className='w-6 h-6' />
                </button>
                <button
                  onClick={nextImage}
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10'
                >
                  <ChevronRight className='w-6 h-6' />
                </button>
              </div>

              {/* Thumbnails */}
              <div className='grid grid-cols-4 gap-4'>
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-full h-16 sm:h-20 rounded-lg overflow-hidden rd-thumb`}
                  >
                    <img
                      src={image}
                      alt={`${name} thumbnail ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                    <div
                      className={`absolute inset-0 pointer-events-none ${
                        currentImageIndex === index
                          ? "bg-brand-primary/40"
                          : "bg-white/20"
                      }`}
                    ></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Room Info */}
            <div className='space-y-8'>
              <h3 className='text-3xl md:text-4xl font-bold text-brand-text mb-2 rd-stagger'>
                {name}
              </h3>

              <div className='flex flex-col lg:flex-row items-start lg:items-center gap-3 mb-5 rd-stagger'>
                <Button
                  style={{ backgroundColor: "#ED5027", borderRadius: "10px" }}
                  variant='primary'
                  className='mt-4 h-9 px-4 rounded-sm'
                  onClick={() => router.push(`/booki/${room.id}`)}
                >
                  {t("rooms.book_room")}
                </Button>
                <div className='bg-white mt-4 rounded-lg h-9 px-3 flex items-center gap-1 border border-border/60 shadow-sm'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className='w-4 h-4 text-amber-400'
                      fill='currentColor'
                    />
                  ))}
                </div>
              </div>

              <p className='text-lg text-brand-text/70 max-w-2xl min-h-[175px] rd-stagger'>
                {description}
              </p>

              {/* Specs */}
              <div>
                <h3 className='text-2xl font-bold text-brand-text mb-4'>
                  {t("rooms.room_details")}
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                  <div className='flex flex-row items-center gap-3 rounded-xl border border-border/50 p-3 bg-white'>
                    <Ruler
                      className='w-5 h-5 text-brand-primary flex-shrink-0'
                      color='#ED5027'
                    />
                    <div className='flex items-center gap-2 w-full justify-between'>
                      <div className='text-sm text-brand-text/60'>
                        {t("rooms.size")}
                      </div>
                      <div className='font-semibold text-brand-text'>
                        {room.size ? `${room.size} m²` : ""}
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-row items-center gap-3 rounded-xl border border-border/50 p-3 bg-white'>
                    <Bed
                      className='w-5 h-5 text-brand-primary flex-shrink-0'
                      color='#ED5027'
                    />
                    <div className='flex items-center gap-2 w-full justify-between'>
                      <div className='text-sm text-brand-text/60'>
                        {t("rooms.bed")}
                      </div>
                      <div className='font-semibold text-brand-text'>
                        {room.bed_type ?? ""}
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-row items-center gap-3 rounded-xl border border-border/50 p-3 bg-white'>
                    <Baby
                      className='w-5 h-5 text-brand-primary flex-shrink-0'
                      color='#ED5027'
                    />
                    <div className='flex items-center gap-2 w-full justify-between'>
                      <div className='text-sm text-brand-text/60'>
                        {t("rooms.children")}
                      </div>
                      <div className='font-semibold text-brand-text'>
                        {(room as any).children_capacity}
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-row items-center gap-3 rounded-xl border border-border/50 p-3 bg-white'>
                    <Layers
                      className='w-5 h-5 text-brand-primary flex-shrink-0'
                      color='#ED5027'
                    />
                    <div className='flex items-center gap-2 w-full justify-between'>
                      <div className='text-sm text-brand-text/60'>
                        {t("rooms.floor")}
                      </div>
                      <div className='font-semibold text-brand-text'>
                        {room.floor ?? ""}
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-row items-center gap-3 rounded-xl border border-border/50 p-3 bg-white'>
                    <Users
                      className='w-5 h-5 text-brand-primary flex-shrink-0'
                      color='#ED5027'
                    />
                    <div className='flex items-center gap-2 w-full justify-between'>
                      <div className='text-sm text-brand-text/60'>
                        {t("rooms.people")}
                      </div>
                      <div className='font-semibold text-brand-text'>
                        {room.capacity ?? ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comments */}
      <section className='py-14'>
        <div className='hotel-container'>
          <div className='mb-8'>
            <h3 className='text-3xl md:text-2xl font-bold text-brand-text'>
              {t("common.comments", {
                defaultValue: `${t("comments.guests_comments_title")}`
              })}
            </h3>
            <p className='text-brand-text/70 mt-2'>
              {t("common.share_thoughts", {
                defaultValue: `${t("comments.guests_comments_subtitle")}`
              })}
            </p>
            <Separator className='mt-4' />
          </div>
          <div className='flex flex-col gap-8 w-full'>
            <div className='w-full'>
              <CommentsList roomId={String(room.id)} />
            </div>
            <Card className='border border-border/60 bg-white w-full'>
              <CardContent className='pt-6'>
                <h4 className='text-xl font-semibold text-brand-text mb-4'>
                  {t("comments.comment", {
                    defaultValue: `${t("comments.comments")}`
                  })}
                </h4>
                <CommentForm roomId={String(room.id)} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Rooms */}
      <section className='py-14'>
        <div className='hotel-container'>
          <h3 className='text-3xl md:text-2xl font-bold text-brand-text mb-6'>
            {t("rooms.related_rooms", {
              defaultValue: `${t("rooms.you_may_be_interested_in")}`
            })}
          </h3>
          <div className='hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {!roomsLoading &&
              relatedRooms.map((r) => {
                const rLang = resolveLang(i18n.language);
                const rName = pickLocalized(r as any, "name", rLang) || "Room";
                const rDesc =
                  pickLocalized(r as any, "description", rLang) || "";
                const rImage = (r.image_1 ||
                  r.image_2 ||
                  r.image_3 ||
                  r.image_4 ||
                  "") as string;
                const rSize = r.size ? `${r.size} m²` : "";
                const priceNumber = (r as any).price_standard ?? undefined;
                const rPriceText =
                  priceNumber !== undefined
                    ? `${formatPrice(String(priceNumber), i18n.language)}/${t(
                        "common.night",
                        { defaultValue: "night" }
                      )}`
                    : "";
                const childrenCapacity = (r as any).children_capacity ?? 0;
                return (
                  <RoomCard
                    key={String(r.id)}
                    id={r.id as any}
                    name={rName}
                    image={rImage}
                    size={rSize}
                    priceText={rPriceText}
                    beds={undefined as any}
                    children={childrenCapacity}
                    description={rDesc}
                    onViewPath={`/room/${r.id}`}
                    floor={r.floor ?? undefined}
                    people={r.capacity ?? undefined}
                  />
                );
              })}
          </div>
          <div className='block md:hidden'>
            {!roomsLoading && relatedRooms.length > 0 && (
              <Carousel
                className='relative'
                opts={{ align: "start", loop: true }}
              >
                <CarouselContent>
                  {relatedRooms.map((r) => {
                    const rLang = resolveLang(i18n.language);
                    const rName =
                      pickLocalized(r as any, "name", rLang) || "Room";
                    const rDesc =
                      pickLocalized(r as any, "description", rLang) || "";
                    const rImage = (r.image_1 ||
                      r.image_2 ||
                      r.image_3 ||
                      r.image_4 ||
                      "") as string;
                    const rSize = r.size ? `${r.size} m²` : "";
                    const priceNumber = (r as any).price_standard ?? undefined;
                    const rPriceText =
                      priceNumber !== undefined
                        ? `${formatPrice(
                            String(priceNumber),
                            i18n.language
                          )}/${t("common.night", { defaultValue: "night" })}`
                        : "";
                    const childrenCapacity = (r as any).children_capacity ?? 0;
                    return (
                      <CarouselItem key={String(r.id)} className='basis-full'>
                        <RoomCard
                          id={r.id as any}
                          name={rName}
                          image={rImage}
                          size={rSize}
                          priceText={rPriceText}
                          beds={undefined as any}
                          children={childrenCapacity}
                          description={rDesc}
                          onViewPath={`/room/${r.id}`}
                          floor={r.floor ?? undefined}
                          people={r.capacity ?? undefined}
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
