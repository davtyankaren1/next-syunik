import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { splitTitle } from "@/utils/textUtils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  getServices,
  type Service
} from "@/integrations/supabase/api/services";
import { resolveLang, pickLocalized } from "@/utils/i18nSupabase";

const ServicesSection = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getServices();
        if (mounted) setServices(data);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load services");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      className='relative py-24 md:py-28 lg:py-20 lg:min-h-[100vh]'
      id='services'
    >
      <div className='absolute inset-0'>
        <img
          src='/assets/syunik-bg.jpg'
          alt='Background'
          className='w-full h-full object-cover filter blur-sm'
        />
        <div className='absolute inset-0 bg-black/70'></div>
      </div>

      <div className='relative hotel-container z-10 mt-12'>
        <div className='text-center mb-16 animate-fade-in'>
          <div className='section-header section-header-white'>
            <h2 className='text-4xl md:text-5xl section-header-text'>
              {(() => {
                const title = splitTitle(t("services.title"));
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
          <p className='text-lg text-white/80 max-w-2xl mx-auto mt-6'>
            {t("services.subtitle")}
          </p>
        </div>

        <TooltipProvider delayDuration={80}>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {loading && (
              <div className='col-span-full text-center text-white/80'>
                Loading...
              </div>
            )}
            {error && (
              <div className='col-span-full text-center text-red-300 text-sm'>
                {error}
              </div>
            )}
            {!loading &&
              !error &&
              services.map((service, index) => {
                const lang = resolveLang(i18n.language);
                const title = pickLocalized(service as any, "name", lang) || "";
                const image = service.image;
                return (
                  <Tooltip key={service.id || index}>
                    <TooltipTrigger asChild>
                      <div
                        className='group rounded-2xl p-4 sm:p-5 md:p-7 lg:p-6 xl:p-5 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-col md:flex-col items-center justify-center gap-3 sm:gap-4'
                        style={{ animationDelay: `${index * 100}ms` }}
                        aria-label={title}
                      >
                        <div className='w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-24 lg:h-24 xl:w-20 xl:h-20 bg-[#ED4E26]/15 rounded-2xl ring-1 ring-[#ED4E26]/20 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110 group-hover:ring-[#ED4E26]/40'>
                          {image ? (
                            <img
                              src={image}
                              alt={title}
                              className='w-12 h-12 object-contain'
                            />
                          ) : (
                            <Building2 className='[color:#ED4E26] w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 xl:w-10 xl:h-10 transition-colors duration-300' />
                          )}
                        </div>
                        {/* Mobile-only inline text */}
                        <div className='sm:hidden mt-3 text-center'>
                          <div className='text-[13px] font-semibold text-gray-900'>
                            {title}
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side='top'
                      sideOffset={10}
                      className='bg-[#ED4E26] text-white border-[#ED4E26] shadow-xl backdrop-blur-md max-w-xs'
                    >
                      <p className='text-sm leading-relaxed text-white/95'>
                        {title}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
          </div>
        </TooltipProvider>
      </div>
    </section>
  );
};

export default ServicesSection;
