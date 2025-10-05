import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatPhoneNumber } from "@/utils/numberUtils";
import { splitTitle } from "@/utils/textUtils";
import { resolveLang, pickLocalized } from "@/utils/i18nSupabase";
import FullScreenLoader from "@/components/FullScreenLoader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchContact } from "@/features/contact/contactSlice";
import emailjs from "@emailjs/browser";

// Define the coordinates for the map center
const MY_COORDINATES = [39.200460, 46.426636]; // [latitude, longitude]

// -----------------------------------------------------------------------------
// Yandex Map Component (Preserved from your version)
// -----------------------------------------------------------------------------

/**
 * Custom component to handle Yandex Map loading and initialization.
 */
const YandexMap = ({ center, zoom = 12, className = "w-full h-full" }) => {
  const mapRef = useRef(null);
  const isMounted = useRef(false);

  useEffect(() => {
    // Prevent running twice in Strict Mode
    if (isMounted.current) return;
    isMounted.current = true;

    // Check if the map script is already loaded
    if (window.ymaps) {
      // @ts-ignore
      ymaps.ready(init);
    } else if (!document.getElementById("yandex-map-script")) {
      // Load the Yandex Maps API script dynamically
      const script = document.createElement("script");
      script.id = "yandex-map-script";
      // Use 'en_US' language for a globally-friendly interface.
      script.src =
        "https://api-maps.yandex.ru/2.1/?lang=en_US&apikey=YOUR_API_KEY"; // Replace YOUR_API_KEY if you have one
      script.type = "text/javascript";
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        if (window.ymaps) {
          // @ts-ignore
          ymaps.ready(init);
        }
      };

      script.onerror = () => {
        console.error("Failed to load Yandex Maps script.");
      };
    } else {
      // If script is loading/loaded, try to wait for readiness (less common scenario)
      const checkReady = setInterval(() => {
        if (window.ymaps) {
          clearInterval(checkReady);
          // @ts-ignore
          ymaps.ready(init);
        }
      }, 100);
    }

    function init() {
      // @ts-ignore
      if (typeof window.ymaps.Map === "undefined" || !mapRef.current) return;

      // Initialize the map
      // @ts-ignore
      const myMap = new window.ymaps.Map(
        mapRef.current,
        {
          center: [center[0], center[1]], // Yandex Map uses [latitude, longitude]
          zoom: zoom,
          controls: ["zoomControl", "fullscreenControl"]
        },
        {
          searchControlProvider: "yandex#search"
        }
      );

      // Add a placemark at the hotel location
      // @ts-ignore
      // const placemark = new window.ymaps.Placemark([center[0], center[1]], {
      //   hintContent: "Syunik Hotel",
      //   balloonContent: "Syunik Hotel, Kapan, Armenia"
      // }, {
      //   preset: 'islands#hotelIcon', // A preset icon for hotels
      //   iconColor: '#ff6600' // Custom color for the placemark
      // });

      // myMap.geoObjects.add(placemark);

      // Add a placemark at the hotel location
      // @ts-ignore
      // const placemark = new window.ymaps.Placemark([center[0], center[1]], {
      //   hintContent: "Syunik Hotel", // <-- This is the popup title when hovering
      //   balloonContent: "Syunik Hotel, Kapan, Armenia" // <-- This is the content when clicking
      // }, {
      //   preset: 'islands#hotelIcon', // A preset icon for hotels
      //   iconColor: '#ff6600' // Custom color for the placemark
      // });

      // myMap.geoObjects.add(placemark);

      const placemark = new window.ymaps.Placemark(
        [center[0], center[1]],
        {
          // ✅ The text that appears on hover
          hintContent: "Syunik Hotel",
          // ✅ The content that appears when the placemark is clicked
          balloonContent: "Syunik Hotel, Kapan, Armenia"
        },
        {
          preset: "islands#hotelIcon", // A preset icon for hotels
          iconColor: "#ff6600" // Custom color for the placemark
        }
      );

      myMap.geoObjects.add(placemark);
    }

    // Cleanup function
    return () => {
      isMounted.current = false;
      // In a real app, you'd try to destroy the map instance here if the API supported it easily.
    };
  }, [center, zoom]);

  // className="w-full h-full" is important inside the MapSelector to fill the 300px container
  return <div ref={mapRef} id='yandex-map' className={className} />;
};

// -----------------------------------------------------------------------------
// Map Selector Component (New)
// -----------------------------------------------------------------------------

/**
 * Component to hold both map options with a switch.
 */
const MapSelector = () => {
  // State to toggle between the two maps
  const [activeMap, setActiveMap] = useState("yandex"); // 'yandex' or 'google'
  const [lat, lng] = MY_COORDINATES;

  // Google Maps Embed URL (uses [latitude, longitude])
  // The format is for an embed link pointing to the coordinates.
  // We use a general format that includes the coordinates and zoom level (z=14).
  const googleMapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3091.8674395594135!2d46.42154208260323!3d39.20046075571154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40163d9145b8304b%3A0xbfcf659a02692660!2sSyunik%20hotel!5e0!3m2!1sen!2sus!4v1759395256868!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"`;

  // The h-[300px] class ensures the map container has a fixed height, which is necessary for embedded maps.
  const mapContainerHeightClass = "w-full h-[225px]";

  return (
    <Card className='overflow-hidden border-[1px] border-orangered'>
      <div className='flex p-2 space-x-2 bg-gray-50 border-b border-orangered'>
        <Button
          onClick={() => setActiveMap("yandex")}
          variant={activeMap === "yandex" ? "primary" : "outline"}
          size='sm'
        >
          Yandex Map
        </Button>
        <Button
          onClick={() => setActiveMap("google")}
          variant={activeMap === "google" ? "primary" : "outline"}
          size='sm'
        >
          Google Map
        </Button>
      </div>

      <div className={`relative ${mapContainerHeightClass}`}>
        {/* Yandex Map View - Conditionally rendered with fade transition */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            activeMap === "yandex"
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* The YandexMap component will take up the full height of the parent div */}
          <YandexMap
            center={MY_COORDINATES}
            zoom={14}
            className='w-full h-full'
          />
        </div>

        {/* Google Map View (using iframe) - Conditionally rendered */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            activeMap === "google"
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <iframe
            src={googleMapsUrl}
            width='100%'
            height='100%'
            style={{ border: 0 }}
            allowFullScreen
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
            title='Google Map Location'
          ></iframe>
        </div>
      </div>
    </Card>
  );
};

const Contact = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { data: contact, loading, error } = useAppSelector((s) => s.contact);
  const [formData, setFormData] = useState({
    name: "",
    email: "", // optional; template may use it for Reply-To
    phone: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchContact());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError(null);

    try {
      // Prefer env vars if present, else fallback to provided IDs
      const serviceId = (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID || "service_qw33uys";
      const templateId = (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID || "template_744r3tz";
      const publicKey = (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY || "bgUIAebQTuk8B6-wZ";

      const templateParams: Record<string, any> = {
        title: "Contact Us",
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
        email: formData.email || "",
        time: new Date().toLocaleString(),
      };

      await emailjs.send(serviceId, templateId, templateParams, { publicKey });

      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 4000);
    } catch (err: any) {
      console.error("EmailJS send error", err);
      setSendError(err?.text || err?.message || "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  // Build contact info from fetched data
  const lang = resolveLang(i18n.language);
  const localizedAddress = contact
    ? pickLocalized(contact as any, "address", lang)
    : "";
  const phone1 = contact?.phone1
    ? formatPhoneNumber(contact.phone1, i18n.language)
    : null;
  const phone2 = contact?.phone2
    ? formatPhoneNumber(contact.phone2, i18n.language)
    : null;

  const contactInfo = [
    {
      icon: <Phone className='w-6 h-6' />,
      title: t("contact.phone"),
      details: [phone1].filter(Boolean) as string[],
      color: "text-brand-primary"
    },
    {
      icon: <Mail className='w-6 h-6' />,
      title: t("contact.email"),
      details: contact?.email ? [contact.email] : [],
      color: "text-brand-primary"
    },
    {
      icon: <MapPin className='w-6 h-6' />,
      title: t("contact.address"),
      details: localizedAddress ? [localizedAddress] : [],
      color: "text-brand-primary"
    },
    {
      icon: <Clock className='w-6 h-6' />,
      title: t("contact.working_hours", { defaultValue: "Working Hours" }),
      details: contact?.working_hours ? [contact.working_hours] : [],
      color: "text-brand-primary"
    }
  ];
  return (
    <section id='contact' className='py-32 bg-white'>
      {loading && <FullScreenLoader />}
      <div className='hotel-container'>
        <div className='text-center mb-16 animate-fade-in'>
          <div className='section-header'>
            <h2 className='text-3xl md:text-4xl section-header-text flex md:inline-flex'>
              {(() => {
                const title = splitTitle(t("contact.title"));
                return title.hasTwoWords ? (
                  <>
                    <span>{title.firstWord}</span>
                    <span className='accent-word ml-2'>{title.restWords}</span>
                  </>
                ) : (
                  title.firstWord
                );
              })()}
            </h2>
          </div>
          <p className='text-lg text-brand-text/70 max-w-2xl mx-auto mt-6'>
            {t("contact.subtitle")}
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
          {/* Contact Information */}
          <div className='space-y-8 animate-fade-in'>
            <div>
              <h3 className='text-2xl font-bold text-brand-text mb-6'>
                {t("contact.title")}
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {contactInfo.map((item, index) => (
                  <Card
                    key={index}
                    className='p-6 border-[1px] border-orangered transition-all duration-300 transform '
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className='flex items-start space-x-4'>
                      <div
                        className={`${item.color} bg-brand-accent/20 p-3 rounded-lg`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <h4 className='font-semibold text-brand-text mb-2'>
                          {item.title}
                        </h4>
                        {item.details.map((detail, i) => (
                          <p key={i} className='text-brand-text/70 text-sm'>
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Map Selector replaces the old fixed Yandex Map */}
            <MapSelector />
          </div>

          {/* Contact Form */}
          <div className='animate-fade-in'>
            <Card className='relative border-[1px] border-orangered overflow-hidden'>
              <CardContent className='relative z-10 p-8'>
                <h3 className='text-2xl font-bold text-brand-text mb-6'>
                  {t("contact.sendMessage")}
                </h3>

                {isSubmitted ? (
                  <div className='text-center py-8 animate-fade-in'>
                    <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
                    <h4 className='text-xl font-semibold text-brand-text mb-2'>
                      Message Sent!
                    </h4>
                    <p className='text-brand-text/70'>
                      Thank you for contacting us. We'll get back to you within
                      24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-medium text-brand-text mb-2'>
                          {t("contact.yourName")} *
                        </label>
                        <Input
                          name='name'
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={t("contact.yourName")}
                          required
                          className='bg-white border-[1px] border-orangered focus:border-brand-primary'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-brand-text mb-2'>
                        {t("contact.yourPhone")} *
                      </label>
                      <Input
                        type='tel'
                        name='phone'
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t("contact.yourPhone")}
                        required
                        className='bg-white border-[1px] border-orangered focus:border-brand-primary'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-brand-text mb-2'>
                        {t("contact.message")} *
                      </label>
                      <Textarea
                        name='message'
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t("contact.message")}
                        rows={11}
                        required
                        className='bg-white border-[1px] border-orangered focus:border-brand-primary resize-none'
                      />
                    </div>

                    {sendError && (
                      <div className='text-sm text-red-600'>
                        {sendError}
                      </div>
                    )}

                    <Button
                      type='submit'
                      variant='primary'
                      size='lg'
                      className='w-full group disabled:opacity-60'
                      disabled={sending}
                    >
                      <Send className='w-4 h-4 mr-2 transition-transform duration-200' />
                      {sending ? t("common.sending", { defaultValue: "Sending..." }) : t("contact.send")}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
