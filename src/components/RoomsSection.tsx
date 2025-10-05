"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { formatPrice } from "@/utils/numberUtils";
import { splitTitle } from "@/utils/textUtils";
import RoomCard from "@/components/RoomCard";
import { getRooms, type Room } from "@/integrations/supabase/api/rooms";
import { resolveLang, pickLocalized } from "@/utils/i18nSupabase";

const RoomsSection = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getRooms();
        if (mounted) setRooms(data.slice(0, 3));
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load rooms");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id='rooms' className='py-28 bg-background'>
      <div className='hotel-container'>
        <div className='text-center mb-16 animate-fade-in'>
          <div className='section-header'>
            <h2 className='text-4xl md:text-5xl section-header-text'>
              {(() => {
                const title = splitTitle(t("rooms.title"));
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
          <p className='text-lg text-brand-text/70 max-w-2xl mx-auto mt-6'>
            {t("rooms.subtitle")}
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          {loading && (
            <div className='col-span-full text-center text-brand-text/70'>
              Loading...
            </div>
          )}
          {error && (
            <div className='col-span-full text-center text-red-600 text-sm'>
              {error}
            </div>
          )}
          {!loading &&
            !error &&
            rooms.map((room) => {
              const lang = resolveLang(i18n.language);
              const name = pickLocalized(room as any, "name", lang) || "";
              const description =
                pickLocalized(room as any, "description", lang) || "";
              const image =
                room.image_1 ||
                room.image_2 ||
                room.image_3 ||
                room.image_4 ||
                "";
              const sizeText = room.size ? `${room.size} m²` : "";
              const priceNumber = room.price_standard ?? undefined;
              const priceText =
                priceNumber !== undefined
                  ? `${formatPrice(String(priceNumber), i18n.language)}/${t(
                      "common.night"
                    )}`
                  : "";
              const childrenCapacity = (room as any).children_capacity ?? 0;
              return (
                <RoomCard
                  key={room.id}
                  id={room.id as any}
                  name={name}
                  image={image}
                  size={sizeText}
                  priceText={priceText}
                  beds={1}
                  children={childrenCapacity}
                  description={description}
                  floor={room.floor ?? undefined}
                  people={room.capacity ?? undefined}
                  onViewPath={`/room/${room.id}`}
                />
              );
            })}
        </div>

        <div className='text-center'>
          <Button
            variant='primary'
            size='lg'
            onClick={() => router.push("/rooms")}
            className='px-8 rounded-full bg-[hsl(var(--brand-primary))] text-white hover:opacity-90 hover:shadow-md border-none'
            style={{borderRadius: "14px"}}
          >
            {t("rooms.see_rooms")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;
