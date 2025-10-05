import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatPhoneNumber } from "@/utils/numberUtils";
import { useEffect, useState } from "react";
import {
  getSocialLinks,
  type SocialLink
} from "@/integrations/supabase/api/social";
import {
  getContact,
  type Contact as ContactType
} from "@/integrations/supabase/api/contact";
import { resolveLang, pickLocalized } from "@/utils/i18nSupabase";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [contact, setContact] = useState<ContactType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [s, c] = await Promise.all([getSocialLinks(), getContact()]);
        if (!mounted) return;
        setSocials(s);
        setContact(c);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load footer data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const quickLinks = [
    { name: t("nav.home"), href: "home" },
    { name: t("nav.rooms"), href: "rooms" },
    { name: t("nav.about"), href: "about" },
    { name: t("nav.contact"), href: "contact" }
  ];

  const services = [
    t("footer.services.restaurant"),
    t("footer.services.conference"),
    t("footer.services.transfer"),
    t("footer.services.roomService")
  ];

  const goToSection = (sectionId: string) => {
    window.location.assign(`/#${sectionId}`);
  };

  return (
    <footer className='bg-[#640211] text-white'>
      {/* Main Footer Content */}
      <div className='hotel-container py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Hotel Info */}
          <div className='lg:col-span-1'>
            <div className='flex items-center space-x-3 mb-6'>
              <img
                src='/assets/svgs/white-logo.svg'
                alt='Syunik Hotel Logo'
                className='h-12 w-auto'
              />
            </div>
            <p className='text-white/80 mb-6 leading-relaxed'>
              {t("footer.description")}
            </p>

            <div className='flex items-center space-x-1'>
              {loading && <span className='text-white/70 text-sm'>...</span>}
              {error && <span className='text-red-300 text-sm'>{error}</span>}
              {!loading &&
                !error &&
                socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target='_blank'
                    rel='noreferrer'
                    aria-label='social link'
                    className='transition-colors duration-300 hover:scale-105 transform text-white hover:text-brand-accent'
                  >
                    {s.image ? (
                      <img
                        src={s.image}
                        className='h-full w-[25px] object-cover pointer-events-none'
                        style={{ marginRight: "4px", borderRadius: "6px" }}
                      />
                    ) : (
                      <span className='w-[25px] h-[25px] inline-block bg-white/20 rounded' />
                    )}
                  </a>
                ))}
            </div>
          </div>

          <div>
            <h3 className='text-xl font-bold mb-6 text-brand-accent'>
              {t("footer.quickLinks")}
            </h3>
            <ul className='space-y-3'>
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => goToSection(link.href)}
                    className='text-white/80 hover:text-brand-accent transition-colors duration-300 text-left'
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className='text-xl font-bold mb-6 text-brand-accent'>
              {t("footer.ourServices")}
            </h3>
            <ul className='space-y-3'>
              {services.map((service, index) => (
                <li key={index} className='text-white/80 text-sm'>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className='text-xl font-bold mb-6 text-brand-accent'>
              {t("footer.contactInfo")}
            </h3>
            <div className='space-y-4'>
              <div className='flex items-start space-x-3'>
                <MapPin className='w-5 h-5 text-brand-accent mt-1 flex-shrink-0' />
                <div className='text-white/80 text-sm'>
                  {(() => {
                    const lang = resolveLang(i18n.language);
                    const addr = contact
                      ? pickLocalized(contact as any, "address", lang)
                      : "";
                    return addr ? <p>{addr}</p> : <p>-</p>;
                  })()}
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                <Phone className='w-5 h-5 text-brand-accent flex-shrink-0' />
                <div className='text-white/80 text-sm'>
                  {contact?.phone1 && (
                    <p>{formatPhoneNumber(contact.phone1, i18n.language)}</p>
                  )}
                  {contact?.phone2 && (
                    <p>{formatPhoneNumber(contact.phone2, i18n.language)}</p>
                  )}
                  {!contact?.phone1 && !contact?.phone2 && <p>-</p>}
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                <Mail className='w-5 h-5 text-brand-accent flex-shrink-0' />
                <div className='text-white/80 text-sm'>
                  {contact?.email ? <p>{contact.email}</p> : <p>-</p>}
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                <Clock className='w-5 h-5 text-brand-accent flex-shrink-0' />
                <div className='text-white/80 text-sm'>
                  {contact?.working_hours ? (
                    <p>{contact.working_hours}</p>
                  ) : (
                    <p>-</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className='bg-black/30'>
        <div className='hotel-container py-6'>
          <div className='flex flex-col md:flex-row justify-between items-center text-sm text-white/60'>
            <div className='mb-4 md:mb-0'>
              <p>
                &copy; {formatPhoneNumber("2024", i18n.language)} Syunik
                Boutique Hotel. {t("common.allRightsReserved")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
