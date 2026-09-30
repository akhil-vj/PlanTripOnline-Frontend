import { useOutletContext, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function CountryPage() {
  const data = useOutletContext();
  const { country } = useParams();

  return (
    <div className="country-page">
      <Helmet>
        <title>{data.name} Travel & Tours - PlanTripOnline</title>
        <meta name="description" content={data.description} />
      </Helmet>

      <section className="hero-section" style={{ backgroundImage: `url(${data.heroImage})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">{data.name} {data.flag}</h1>
          <p className="hero-subtitle">{data.tagline}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Welcome to {data.name}</h2>
          <p>{data.description}</p>
        </div>
      </section>
    </div>
  );
}
