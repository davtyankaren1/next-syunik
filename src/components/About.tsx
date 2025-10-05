import { Award, Users, Calendar, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { formatNumber } from "@/utils/numberUtils";
import { splitTitle } from "@/utils/textUtils";
import { resolveLang } from "@/utils/i18nSupabase";
import FullScreenLoader from "@/components/FullScreenLoader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAbout } from "@/features/about/aboutSlice";

const About = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { data: about, loading, error } = useAppSelector((s) => s.about);

  useEffect(() => {
    dispatch(fetchAbout());
  }, [dispatch]);

  const stats = [
    {
      icon: <Award className='w-8 h-8' />,
      number: formatNumber("15", i18n.language),
      label: t("about.yearsExperience")
    },
    {
      icon: <Users className='w-8 h-8' />,
      number: formatNumber("50", i18n.language) + "k+",
      label: t("about.happyGuests")
    },
    {
      icon: <Calendar className='w-8 h-8' />,
      number: formatNumber("365", i18n.language),
      label: t("about.daysOpen")
    },
    {
      icon: <Sparkles className='w-8 h-8' />,
      number: formatNumber("4.9", i18n.language) + "★",
      label: t("about.rating")
    }
  ];

  // Resolve language and about text (from Supabase) once per render
  const lang = resolveLang(i18n.language);
  const aboutText = (() => {
    if (!about) return "";
    // Map language to correct column names per provided schema
    const order = [lang, "en", "am", "ru", "fa"] as const;
    for (const code of order) {
      switch (code) {
        case "am":
          if (about.about_text && about.about_text.trim())
            return about.about_text;
          break;
        case "en":
          if (about.about_en_text && about.about_en_text.trim())
            return about.about_en_text;
          break;
        case "ru":
          if (about.about_ru_text && about.about_ru_text.trim())
            return about.about_ru_text;
          break;
        case "fa":
          if (about.about_fa_text && about.about_fa_text.trim())
            return about.about_fa_text;
          break;
      }
    }
    return "";
  })();

  return (
    <section
      id='about'
      className='relative py-24 md:py-28 lg:py-32 lg:min-h-[85vh] bg-gradient-to-br from-background to-brand-accent/20 overflow-hidden'
    >
      <div className='hotel-container relative z-10'>
        {loading && <FullScreenLoader />}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          {/* Left Images */}
          <div className='relative grid grid-cols-2 gap-4 animate-fade-in'>
            {/* Blurred PNG overlay */}
            <img
              src='/assets/svgs/white-logo-sign.svg'
              alt='Blur Overlay'
              className='absolute top-[-180px] left-[-170px] h-full w-3/4 object-cover opacity-50 filter blur-sm pointer-events-none'
            />

            <img
              src='/assets/svgs/white-logo-sign.svg'
              alt='Blur Overlay'
              className='absolute bottom-[-100px] right-[-1000px] h-full w-4/4 object-cover opacity-50 filter blur-sm pointer-events-none'
            />

            <div className='space-y-4 z-10 relative'>
              <img
                src={about?.image_1 || "/assets/syunik-hotel-1.jpg"}
                alt='About Image 1'
                className='about-image-1 w-full h-48 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300'
              />
              <img
                src={about?.image_2 || "/assets/syunik-hotel-7.jpg"}
                alt='About Image 2'
                className='about-image-2 w-full h-49 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300'
              />
            </div>
            <div className='space-y-4 mt-8 z-10 relative'>
              <img
                src={about?.image_3 || "/assets/syunik-hotel-4.jpg"}
                alt='About Image 3'
                className='about-image-3 w-full h-48 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300'
              />
              <img
                src={about?.image_4 || "/assets/syunik-hotel-2.jpg"}
                alt='About Image 4'
                className='about-image-4 w-full h-48 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300'
              />
            </div>
          </div>

          {/* Right Content */}
          <div className='animate-fade-in'>
            <div className='section-header justify-start mb-6'>
              <h2 className='text-3xl md:text-4xl section-header-text'>
                {(() => {
                  const title = splitTitle(t("about.title"));
                  return title.hasTwoWords ? (
                    <>
                      {title.firstWord}{" "}
                      <span className='accent-word'>{title.restWords}</span>
                    </>
                  ) : (
                    title.firstWord
                  );
                })()}
              </h2>
            </div>
            <p className='text-lg text-brand-text/70 mb-6 leading-relaxed whitespace-pre-line'>
              {about ? aboutText : t("about.description")}
            </p>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className='text-center animate-slide-up bg-white border border-white/30 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300'
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className='flex justify-center text-brand-primary mb-1'>
                    {stat.icon}
                  </div>
                  <div className='text-xl font-semibold text-brand-text'>
                    {stat.number}
                  </div>
                  <div className='text-xs text-brand-text/60'>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
