interface BookingIframePageProps {
  params: { id: string };
}

export default function BookingIframePage({ params }: BookingIframePageProps) {
  return (
    <main>
      <h1>Booking Iframe</h1>
      <p>id: {params.id}</p>
      {/* TODO: Port Vite `BookingIframe` page here */}
    </main>
  );
}
