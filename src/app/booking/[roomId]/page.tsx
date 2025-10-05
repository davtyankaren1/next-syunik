"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { t } from "i18next";
import { ArrowLeft, ChevronLeft, ChevronRight, Users, Bed, Baby } from "lucide-react";
import BackButton from "@/components/BackButton";

interface PageProps { params: { roomId: string } }

export default function BookingPage({ params }: PageProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Mock room data (in real app, fetch by roomId)
  const room = {
    id: params.roomId,
    name: "Դելյուքս սենյակ",
    gallery: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80",
    ],
    size: "45 m²",
    price: 1500,
    beds: 1,
    children: 2,
    guests: 2,
    description:
      "Spacious suite with mountain views and premium amenities. Features a separate living area, marble bathroom, and private balcony.",
    amenities: ["Free WiFi", "Parking", "Room Service", "Gym Access"],
    features: [
      "King-size bed with premium linens",
      "Separate living area with sofa",
      "Marble bathroom with rain shower",
      "Private balcony with mountain views",
      "Mini-bar and coffee station",
      "Work desk with ergonomic chair",
      "Climate control",
      "Safe deposit box",
    ],
  };

  const nextImage = () => setCurrentImageIndex((p) => (p + 1) % room.gallery.length);
  const prevImage = () => setCurrentImageIndex((p) => (p - 1 + room.gallery.length) % room.gallery.length);

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    return 0;
  };
  const calculateTotal = () => calculateNights() * room.price;

  return (
    <div className='min-h-screen bg-background'>
      <Header forceWhite={true} />

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
          <div className='lg:col-span-2 space-y-8'>
            <div className='relative flex gap-4'>
              <div className='relative flex-1 h-96 md:h-[500px] rounded-2xl overflow-hidden'>
                <img src={room.gallery[currentImageIndex]} alt={`${room.name} - Image ${currentImageIndex + 1}`} className='w-full h-full object-cover' />
                <button onClick={prevImage} className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brand-text rounded-full p-2'>
                  <ChevronLeft className='w-5 h-5' />
                </button>
                <button onClick={nextImage} className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brand-text rounded-full p-2'>
                  <ChevronRight className='w-5 h-5' />
                </button>
                <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2'>
                  {room.gallery.map((_, index) => (
                    <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full ${currentImageIndex === index ? "bg-white" : "bg-white/50"}`} />
                  ))}
                </div>
              </div>
              <div className='flex flex-col gap-2 w-24'>
                {room.gallery.map((image, index) => (
                  <button key={index} onClick={() => setCurrentImageIndex(index)} className={`relative h-20 rounded-lg overflow-hidden ${currentImageIndex === index ? "ring-2 ring-brand-primary" : "opacity-70 hover:opacity-100"}`}>
                    <img src={image} alt={`${room.name} thumbnail ${index + 1}`} className='w-full h-full object-cover' />
                  </button>
                ))}
              </div>
            </div>

            <div className='bg-white rounded-2xl p-6 shadow-sm'>
              <h1 className='text-3xl md:text-4xl font-bold text-brand-text '>{room.name}</h1>
              <p className='text-brand-text/70 mt-4'>{room.description}</p>
              <div className='flex items-center gap-6 text-brand-text/70 mt-4'>
                <div className='flex items-center gap-2'><span className='w-6 h-6 bg-brand-accent rounded flex items-center justify-center text-xs'>m²</span><span>{room.size}</span></div>
                <div className='flex items-center gap-2'><Users className='w-5 h-5' /><span>{room.guests} guests</span></div>
                <div className='flex items-center gap-2'><Bed className='w-5 h-5' /><span>{room.beds} bed</span></div>
                <div className='flex items-center gap-2'><Baby className='w-5 h-5' /><span>{room.children} children max</span></div>
              </div>
            </div>
          </div>

          {/* Booking form */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-2xl p-6 shadow-sm'>
              <h2 className='text-brand-text text-xl font-semibold mb-4'>Book Your Stay</h2>
              <form className='space-y-4'>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='text-sm text-brand-text/70 block mb-1'>Name</label>
                    <input type='text' placeholder='John' className='w-full rounded-lg border border-brand-accent/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary' />
                  </div>
                  <div>
                    <label className='text-sm text-brand-text/70 block mb-1'>Surname</label>
                    <input type='text' placeholder='Doe' className='w-full rounded-lg border border-brand-accent/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary' />
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='text-sm text-brand-text/70 block mb-1'>Adults</label>
                    <select className='w-full rounded-lg border border-brand-accent/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary'>
                      {[1,2,3,4].map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className='text-sm text-brand-text/70 block mb-1'>Children</label>
                    <select className='w-full rounded-lg border border-brand-accent/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary'>
                      {[0,1,2,3].map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className='text-sm text-brand-text/70 block mb-1'>Check-in</label>
                  <input type='date' value={checkIn?.toISOString().split("T")[0] || ""} onChange={(e) => setCheckIn(new Date(e.target.value))} className='w-full rounded-lg border border-brand-accent/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary' />
                </div>
                <div>
                  <label className='text-sm text-brand-text/70 block mb-1'>Check-out</label>
                  <input type='date' value={checkOut?.toISOString().split("T")[0] || ""} onChange={(e) => setCheckOut(new Date(e.target.value))} min={checkIn?.toISOString().split("T")[0]} className='w-full rounded-lg border border-brand-accent/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary' />
                </div>
                {checkIn && checkOut && (
                  <div className='bg-brand-accent/20 rounded-lg p-4 space-y-2'>
                    <div className='flex justify-between text-brand-text/70'><span>Nights</span><span>{calculateNights()}</span></div>
                    <div className='flex justify-between text-brand-text/70'><span>Rate per night</span><span>${room.price}</span></div>
                    <div className='border-t border-brand-accent/30 pt-2'>
                      <div className='flex justify-between font-semibold text-brand-text'><span>Total</span><span>${calculateTotal()}</span></div>
                    </div>
                  </div>
                )}
                <Button variant='primary' size='lg' className='w-full' disabled={!checkIn || !checkOut}>
                  {checkIn && checkOut ? `Book for $${calculateTotal()}` : "Select Dates to Book"}
                </Button>
              </form>
              <p className='text-xs text-brand-text/60 text-center mt-2'>Free cancellation up to 24 hours before check-in</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
