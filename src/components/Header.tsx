"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import FlagDropdown from "./FlagDropdown";
import MobileMenu from "./MobileMenu";
import { IoMenu } from "react-icons/io5";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  getSocialLinks,
  type SocialLink
} from "@/integrations/supabase/api/social";
import SyunikLogoSvg from "../../public/assets/svgs/SyunikLogoSvg";

const Header = ({ forceWhite = false }: { forceWhite?: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();
  const path = pathname ?? "";
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [logoHover, setLogoHover] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [socialsLoading, setSocialsLoading] = useState(true);
  const [socialsError, setSocialsError] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update top progress bar
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);

      // Only compute active section by scroll on the homepage
      if (path !== "/") {
        return;
      }

      // Update active section based on scroll position
      const sections = [
        "home",
        "rooms",
        "services",
        "about",
        "reviews",
        "contact"
      ];

      // Use different offset for mobile vs desktop
      const isMobile = window.innerWidth < 768;
      const scrollPos = window.scrollY + (isMobile ? 80 : 100);

      // Find the current section
      let currentSection = "home";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop - (isMobile ? 60 : 80);
          const offsetHeight = element.offsetHeight;

          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            currentSection = section;
            break;
          }
        }
      }

      // Only update if section changed to avoid unnecessary re-renders
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initialize on mount so bar reflects initial position
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection, path]);

  // When navigating to dedicated routes (e.g., /blog or /blog/:id), mark BLOG as active
  useEffect(() => {
    if (path.startsWith("/blog")) {
      setActiveSection('/blog');
    } else if (path === '/' && activeSection === '/blog') {
      // Reset when returning to homepage
      setActiveSection('home');
    }
  }, [path]);

  // Highlight Rooms when on /rooms or any /room/:id route.
  // Also handle homepage hash like /#rooms to mark the section active.
  useEffect(() => {
    if (path === '/rooms' || path.startsWith('/room')) {
      setActiveSection('rooms');
      return;
    }
    if (path === '/' && typeof window !== 'undefined' && window.location.hash) {
      const sectionFromHash = window.location.hash.replace('#', '');
      if (sectionFromHash) {
        setActiveSection(sectionFromHash);
      }
    }
  }, [path]);

  // Load social links
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setSocialsLoading(true);
        const data = await getSocialLinks();
        if (mounted) setSocials(data);
      } catch (e: any) {
        if (mounted) setSocialsError(e?.message || "Failed to load socials");
      } finally {
        if (mounted) setSocialsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleMenuClick = (sectionId: string) => {
    if (path === "/") {
      const el = document.getElementById(sectionId);
      if (el) {
        // Use offset only on mobile; keep desktop behavior unchanged
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          const headerEl = document.querySelector('header') as HTMLElement | null;
          const headerOffset = (headerEl?.offsetHeight ?? 60) + 4; // small buffer
          const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        } else {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setActiveSection(sectionId);
        return;
      }
    }
    router.push(`/#${sectionId}`);
    setActiveSection(sectionId);
  };

  // Kept for potential internal uses; not used for cross-route nav anymore
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    const isMobile = window.innerWidth < 768;
    const headerOffset = isMobile ? 60 : 80;
    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    setActiveSection(sectionId);
  };

  const handleLogoClick = () => {
    if (path === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/#home");
    }
    setActiveSection("home");
  };

  const menuItems = [
    { name: t("nav.home"), href: "home" },
    { name: t("nav.rooms"), href: "rooms" },
    { name: t("nav.services"), href: "services" },
    { name: t("nav.about"), href: "about" },
    { name: t("nav.reviews"), href: "reviews" },
    { name: t("nav.blog"), href: "/blog" },
    { name: t("nav.contact"), href: "contact" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled || forceWhite
          ? "header-scrolled bg-white shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]"
          : "backdrop-blur-sm shadow-[0_8px_24px_-18px_rgba(0,0,0,0.28)]"
      }`}
      style={{ borderBottom: "none" }}
    >
      {/* Scroll progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent">
        <div
          className="h-full transition-[width] duration-150 rounded-r-full bg-[#ED5027]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      <div className='hotel-container pr-3'>
        <nav className='flex items-center justify-between py-4'>
          {/* Logo */}
          <div
            className='flex items-center space-x-3 cursor-pointer'
            onClick={handleLogoClick}
            onMouseEnter={() => setLogoHover(true)}
            onMouseLeave={() => setLogoHover(false)}
          >
            <div className='relative h-14 flex items-center'>
              <SyunikLogoSvg
                color={
                  logoHover
                    ? '#ED5027'
                    : isScrolled || forceWhite
                    ? 'black'
                    : 'white'
                }
              />
            </div>
          </div>

          {/* Navigation Menu */}
          <div className='hidden md:flex items-center space-x-8'>
            {menuItems.map((item) => (
              // <button
              //   key={item.name}
              //   onClick={() => handleMenuClick(item.href)}
              //   className={`menu-item text-sm font-medium transition-colors duration-300 ${
              //     isScrolled || forceWhite
              //       ? "text-brand-text hover:text-brand-primary"
              //       : "text-white hover:text-brand-accent"
              //   } ${activeSection === item.href ? "active" : ""}`}
              // >
              //   {item.name}
              // </button>
              <button
                key={item.name}
                onClick={() => {
                  if (item.href.startsWith('/')) {
                    router.push(item.href);
                  } else {
                    handleMenuClick(item.href);
                  }
                }}
                className={`menu-item text-sm font-medium transition-all duration-300 ${
                  isScrolled || forceWhite
                    ? "text-brand-text hover:text-brand-primary"
                    : "text-white hover:text-brand-accent"
                } ${
                  (item.href.startsWith('/')
                    ? path.startsWith(item.href)
                    : activeSection === item.href)
                    ? "active underline text-brand-primary" // underline when active
                    : ""
                } hover:underline hover:text-brand-primary`} // underline and text color change on hover
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className='flex items-center space-x-4'>
            {/* Social Media */}
            <div className='hidden md:flex items-center space-x-1'>
              {socialsLoading && (
                <span
                  className={
                    isScrolled || forceWhite
                      ? "text-brand-text/70"
                      : "text-white/80"
                  }
                >
                  ...
                </span>
              )}
              {!socialsLoading &&
                !socialsError &&
                socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={`transition-colors duration-300 hover:scale-105 transform ${
                      isScrolled || forceWhite
                        ? "text-brand-text hover:text-brand-primary"
                        : "text-white hover:text-brand-accent"
                    }`}
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

            {/* Language Dropdown */}
            <div
              className={`hidden md:block transition-colors duration-300 ${
                isScrolled || forceWhite ? "text-brand-text" : "text-white"
              }`}
            >
              <FlagDropdown isScrolled={isScrolled || forceWhite} />
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant='ghost'
              className='p-2 hover:bg-gray-100 rounded-full md:hidden'
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <IoMenu
                size={32}
                className={`w-12 h-12 ${
                  isScrolled || forceWhite ? "text-brand-text" : "text-white"
                }`}
              />
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Header;
