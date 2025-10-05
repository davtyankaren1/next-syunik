import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Simple iframe booking page. For now, we ignore :id and use a fixed URL
// Example URLs given by you:
// https://tatiosa.net/booking2.php?propid=244859&roomid=515499&numadult=2&advancedays=-1&referer=SyunikHotel.com
// https://tatiosa.net/booking2.php?propid=244859&roomid=515823&numadult=2&advancedays=-1&referer=SyunikHotel.com

const DEFAULT_BOOKING_URL =
  "https://tatiosa.net/booking2.php?propid=244859&roomid=515823&numadult=2&advancedays=-1&referer=SyunikHotel.com";

const BookingIframe = () => {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  // In the future we can map :id -> proper URL. For now, always use DEFAULT_BOOKING_URL
  const src = DEFAULT_BOOKING_URL;

  useEffect(() => {
    // Scroll to top when opening the booking
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header forceWhite={true} />

      <section className="pt-28 pb-2 bg-gradient-to-b from-background to-background/60">
        <div className="hotel-container">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            aria-label="Back"
            className="group h-10 rounded-full bg-white/70 backdrop-blur-sm text-brand-text border border-black/5 px-4 pr-5 shadow-sm hover:bg-brand-primary hover:text-white hover:border-brand-primary/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="font-medium">Back</span>
          </Button>
        </div>
      </section>

      <section>
        <div className="hotel-container">
          <div className="w-full h-[80vh] sm:h-[85vh] lg:h-[88vh] rounded-xl overflow-hidden border border-border bg-white shadow-sm">
            <iframe
              title="External Booking"
              src={src}
              className="w-full h-full"
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default BookingIframe;
