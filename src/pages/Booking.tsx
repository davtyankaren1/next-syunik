import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Users,
  Bed,
  Baby,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Dumbbell
} from "lucide-react";
import Header from "@/components/Header";
import { t } from "i18next";
import BackButton from "@/components/BackButton";

const Booking = () => {
  const router = useRouter();
  const { roomId } = router.query as { roomId?: string };
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock room data (in real app, fetch by roomId)
  const room = {
    id: 1,
    name: "Դելյուքս սենյակ",
    gallery: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80"
    ],
    size: "45 m²",
    price: 1500,
    beds: 1,
    children: 2,
    guests: 2,
    description:
      "Spacious suite with mountain views and premium amenities. Features a separate living area, marble bathroom, and private balcony overlooking the beautiful Armenian landscape.",
    amenities: ["Free WiFi", "Parking", "Room Service", "Gym Access"],
    features: [
      "King-size bed with premium linens",
      "Separate living area with sofa",
      "Marble bathroom with rain shower",
      "Private balcony with mountain views",
      "Mini-bar and coffee station",
      "Work desk with ergonomic chair",
      "Climate control",
      "Safe deposit box"
    ]
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + room.gallery.length) % room.gallery.length
    );
  };

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

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * room.price;
  };

  return (
    <div className='min-h-screen bg-background'>
      <Header forceWhite={true} />

      {/* Header */}
      <section className='pt-28 pb-3'>
        <div className='hotel-container'>
          {/* <Button
            onClick={() => router.push("/rooms")}
            className='mb-6 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-brand-text shadow-sm transition-all duration-300 hover:bg-brand-primary hover:text-white hover:shadow-md'
          >
            <ArrowLeft className='w-4 h-4' />
            {t("nav.back_button")}
          </Button> */}
          <BackButton 
                        onClick={() => router.push('/rooms')} 
                        label="Go Home" // Optional, you can omit this if you just want "Back"
                      />
        </div>
      </section>

      <div className='hotel-container pb-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Images and Details */}
          <div className='lg:col-span-2 space-y-8'>
            <div className='relative flex gap-4'>
              <div className='relative flex-1 h-96 md:h-[500px] rounded-2xl overflow-hidden'>
                <img
                  src={room.gallery[currentImageIndex]}
                  alt={`${room.name} - Image ${currentImageIndex + 1}`}
                  className='w-full h-full object-cover'
                />

                <button
                  onClick={prevImage}
                  className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-brand-text rounded-full p-2 transition-all duration-200'
                >
                  <ChevronLeft className='w-5 h-5' />
                </button>
                <button
                  onClick={nextImage}
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-brand-text rounded-full p-2 transition-all duration-200'
                >
                  <ChevronRight className='w-5 h-5' />
                </button>

                {/* Dots Indicator */}
                <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
                  {room.gallery.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        currentImageIndex === index ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Vertical Thumbnails */}
              <div className='flex flex-col gap-2 w-24'>
                {room.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                      currentImageIndex === index
                        ? "ring-2 ring-brand-primary"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${room.name} thumbnail ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Room Details */}

            <Card>
              <CardHeader>
                <CardTitle className='text-brand-text'>
                  <h1 className='text-3xl md:text-4xl font-bold text-brand-text '>
                    {room.name}
                  </h1>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <p className='text-brand-text/70'>{room.description}</p>

                {/* Room Info */}
                <div className='flex items-center gap-6 text-brand-text/70'>
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-brand-accent rounded flex items-center justify-center'>
                      <span className='text-xs font-medium'>m²</span>
                    </div>
                    <span>{room.size}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Users className='w-5 h-5' />
                    <span>{room.guests} guests</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Bed className='w-5 h-5' />
                    <span>{room.beds} bed</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Baby className='w-5 h-5' />
                    <span>{room.children} children max</span>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className='font-semibold text-brand-text mb-3'>
                    Amenities
                  </h3>
                  <div className='grid grid-cols-2 gap-3'>
                    {room.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-2 text-brand-text/70'
                      >
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className='font-semibold text-brand-text mb-3'>
                    Room Features
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    {room.features.map((feature, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-2 text-brand-text/70 text-sm'
                      >
                        <div className='w-1.5 h-1.5 bg-brand-primary rounded-full flex-shrink-0' />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Form */}
          <div className='lg:col-span-1'>
            <Card className='top-24'>
              <CardHeader>
                <CardTitle className='text-brand-text'>
                  Book Your Stay
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <form className='space-y-4'>
                  {/* Name + Surname */}
                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <label className='text-sm text-brand-text/70 block mb-1'>
                        Name
                      </label>
                      <input
                        type='text'
                        placeholder='John'
                        className='w-full rounded-lg border border-brand-accent/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary'
                      />
                    </div>
                    <div>
                      <label className='text-sm text-brand-text/70 block mb-1'>
                        Surname
                      </label>
                      <input
                        type='text'
                        placeholder='Doe'
                        className='w-full rounded-lg border border-brand-accent/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary'
                      />
                    </div>
                  </div>

                  {/* Guests & Children */}
                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <label className='text-sm text-brand-text/70 block mb-1'>
                        Adults
                      </label>
                      <select className='w-full rounded-lg border border-brand-accent/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary'>
                        {[1, 2, 3, 4].map((n) => (
                          <option key={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className='text-sm text-brand-text/70 block mb-1'>
                        Children
                      </label>
                      <select className='w-full rounded-lg border border-brand-accent/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary'>
                        {[0, 1, 2, 3].map((n) => (
                          <option key={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dates */}
                  <div>
                    <label className='text-sm text-brand-text/70 block mb-1'>
                      Check-in
                    </label>
                    <input
                      type='date'
                      value={checkIn?.toISOString().split("T")[0] || ""}
                      onChange={(e) => setCheckIn(new Date(e.target.value))}
                      className='w-full rounded-lg border border-brand-accent/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary'
                    />
                  </div>
                  <div>
                    <label className='text-sm text-brand-text/70 block mb-1'>
                      Check-out
                    </label>
                    <input
                      type='date'
                      value={checkOut?.toISOString().split("T")[0] || ""}
                      onChange={(e) => setCheckOut(new Date(e.target.value))}
                      min={checkIn?.toISOString().split("T")[0]}
                      className='w-full rounded-lg border border-brand-accent/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary'
                    />
                  </div>

                  {/* Booking Summary */}
                  {checkIn && checkOut && (
                    <div className='bg-brand-accent/20 rounded-lg p-4 space-y-2'>
                      <div className='flex justify-between text-brand-text/70'>
                        <span>Nights</span>
                        <span>{calculateNights()}</span>
                      </div>
                      <div className='flex justify-between text-brand-text/70'>
                        <span>Rate per night</span>
                        <span>${room.price}</span>
                      </div>
                      <div className='border-t border-brand-accent/30 pt-2'>
                        <div className='flex justify-between font-semibold text-brand-text'>
                          <span>Total</span>
                          <span>${calculateTotal()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Book Button */}
                  <Button
                    variant='primary'
                    size='lg'
                    className='w-full'
                    disabled={!checkIn || !checkOut}
                  >
                    {checkIn && checkOut
                      ? `Book for $${calculateTotal()}`
                      : "Select Dates to Book"}
                  </Button>

                  <p className='text-xs text-brand-text/60 text-center'>
                    Free cancellation up to 24 hours before check-in
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Booking;
