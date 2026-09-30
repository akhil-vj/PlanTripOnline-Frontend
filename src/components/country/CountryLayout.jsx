import { Outlet, useParams } from 'react-router-dom';
import { getCountryData } from '../../data';

export default function CountryLayout() {
  const { country } = useParams();
  const data = getCountryData(country);

  if (!data) {
    return (
      <div className="section">
        <div className="container">
          <h2>Country not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="country-layout">
      {/* Country specific header can go here if needed, but we have global layout */}
      <Outlet context={data} />
    </div>
  );
}
