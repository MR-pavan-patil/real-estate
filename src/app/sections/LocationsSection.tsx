import LocationBrowse from '@/components/public/LocationBrowse';

interface LocationInfo {
  location: string;
  count: number;
}

export default function LocationsSection({ locations }: { locations: LocationInfo[] }) {
  if (!locations || locations.length === 0) return null;

  return (
    <section className="section-padding" style={{ background: '#ffffff' }}>
      <div className="container-main">
        <LocationBrowse locations={locations} />
      </div>
    </section>
  );
}
