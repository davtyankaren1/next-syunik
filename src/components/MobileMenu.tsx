"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import FlagDropdown from "./FlagDropdown";
import { useTranslation } from "react-i18next";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const path = pathname ?? "/";
  const [activeSection, setActiveSection] = useState("home");

  // Set active section based on scroll position when menu opens
  useEffect(() => {
    if (isOpen) {
      // Check if we're at the top of the page (hero section)
      if (window.scrollY < 100) {
        setActiveSection("home");
      } else {
        // Try to determine which section is currently visible
        const sections = [
          "home",
          "rooms",
          "services",
          "about",
          "reviews",
          "contact"
        ];
        const isMobile = window.innerWidth < 768;
        const headerOffset = isMobile ? 60 : 80;
        const scrollPos = window.scrollY + headerOffset;

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const offsetTop = element.offsetTop - headerOffset;
            const offsetHeight = element.offsetHeight;

            if (
              scrollPos >= offsetTop &&
              scrollPos < offsetTop + offsetHeight
            ) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    }
  }, [isOpen]);
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsAnimating(true);
      // Small delay to trigger entrance animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Allow exit animation to complete before hiding
      setTimeout(() => {
        setIsAnimating(false);
        document.body.style.overflow = "unset";
      }, 300);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const menuItems = [
    { name: t("nav.home"), href: "home", path: "/" },
    { name: t("nav.rooms"), href: "rooms", path: "/" }, // navigate to rooms section on homepage
    { name: t("nav.services"), href: "services", path: "/" },
    { name: t("nav.about"), href: "about", path: "/" },
    { name: t("nav.reviews"), href: "reviews", path: "/" },
    { name: t("nav.blog"), href: "blog", path: "blog" },
    { name: t("nav.contact"), href: "contact", path: "/" }
  ];

  const handleMenuClick = (item: (typeof menuItems)[0]) => {
    if (item.path === "/" && path === "/") {
      const el = document.getElementById(item.href);
      if (el) {
        // Offset for fixed header (mobile vs desktop)
        const isMobile = window.innerWidth < 768;
        const headerOffset = isMobile ? 60 : 80;
        const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        setActiveSection(item.href);
        onClose();
        return;
      }
    }
    router.push(`/${item.path === "/" ? "#" + item.href : item.path}`);
    setActiveSection(item.href);
    onClose();
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const isMobile = window.innerWidth < 768;
      const headerOffset = isMobile ? 60 : 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      setActiveSection(sectionId);
    }
  };

  const handleLogoClick = () => {
    router.push("/#home");
    setActiveSection("home");
    onClose();
  };

  if (!isOpen && !isAnimating) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[10000] md:hidden isolate transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm z-10 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Menu Content */}
      <div
        className={`absolute inset-0 bg-white z-20 transition-all duration-300 ease-out ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-gray-100'>
            <div
              className='flex items-center space-x-3 cursor-pointer'
              onClick={handleLogoClick}
            >
              <img
                src='https://syunikhotel.com/images/main_logo.svg'
                alt='Syunik Hotel Logo'
                className='h-12 w-auto'
              />
              
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={onClose}
              className='p-2 hover:bg-gray-100 rounded-full'
            >
              <X className='w-8 h-8 text-gray-600' />
            </Button>
          </div>
          <div className='w-full ml-7'>
              <FlagDropdown isScrolled={true} onClose={onClose} />
            </div>

          {/* Menu Items */}
          <div className=' px-6 py-8 space-y-2'>
            {menuItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item)}
                className={`relative w-full text-left py-3 px-4 rounded-xl text-lg font-medium transition-all duration-300
      ${
        activeSection === item.href
          ? "text-brand-primary"
          : "text-gray-700 hover:text-brand-primary"
      }
      ${isVisible ? "animate-fade-in" : ""}
    `}
                style={{
                  animationDelay: isVisible ? `${index * 100}ms` : "0ms",
                  animationFillMode: "both",
                  transform: isVisible ? "translateY(0)" : "translateY(20px)",
                  transition: `all 300ms ease-out ${index * 50}ms`
                }}
              >
                {item.name}
                {/* Underline effect */}
                <span
                  className={`absolute left-4 bottom-2 h-[2px] bg-brand-primary rounded-full transition-all duration-500 ease-out
        ${
          activeSection === item.href
            ? "w-[calc(100%-2rem)] opacity-100 scale-x-100"
            : "w-0 opacity-0 scale-x-0"
        }
      `}
                />
              </button>
            ))}
          </div>

          {/* Language Selector */}
          {/* <div className='px-6 mt-6 pt-4 border-t border-gray-100'>
            <h3 className='text-sm font-medium text-gray-500 mb-3'>
              {t("language")}
            </h3>
            <div className='w-full'>
              <FlagDropdown isScrolled={true} onClose={onClose} />
            </div>
          </div> */}

          {/* Social Media & Footer */}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MobileMenu;
