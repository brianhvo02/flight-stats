import './Flight.scss'
import { useNavigate, useParams } from 'react-router-dom';
import { useGetFlightInfoQuery } from '../store/flightData';
import { skipToken } from '@reduxjs/toolkit/dist/query';

const Flight = () => {
    const navigate = useNavigate();
    const { flightId } = useParams();
    const { data, isLoading } = useGetFlightInfoQuery(flightId ?? skipToken, {
        pollingInterval: 6000
    });

    if (isLoading)
        return <p>Loading...</p>;

    if (!data)
        return <p>No data.</p>

    return (
        <div className='flight-show'>
            <button onClick={() => navigate(-1)}>Back</button>
            <header>
                <div>
                    <h1>{data.flightNumber ?? data.callsign}</h1>
                    {data.flightNumber ? <h3>{data.callsign}</h3> : null}
                </div>
                <img src={data.airline?.imageUrl} alt={`${data.airline?.name} logo`} />
            </header>
            <div className='origin-destination'>
            {
                data.origin &&
                <article>
                    <section>
                        <p>
                            {data.origin.city}
                            <span>({data.origin.iata} / {data.origin.icao})</span>
                        </p>
                        <span>{data.origin.name}</span>
                        <span>{data.origin.latitude}, {data.origin.longitude}</span>
                    </section>
                    {
                        data.times?.departure &&
                        <section>
                            <p>{data.times.departure.estimated ? data.times.departure.estimated : data.times.departure.actual} {data.times.departure.timezone.short} - {data.times.departure.relative}</p>
                            <span>Scheduled: {data.times.departure.scheduled} {data.times.departure.timezone.short}</span>
                        </section>
                    }
                    <section className='airport-info'>
                        <h3>Terminal</h3>
                        <h3>Gate</h3>
                        <h3>Runway</h3>
                        <p>{data.origin.terminal ?? '-'}</p>
                        <p>{data.origin.gate ?? '-'}</p>
                        <p>{data.origin.runway ?? '-'}</p>
                    </section>
                </article>
            }
            {
                data.destination &&
                <article>
                    <section>
                        <p>
                            {data.destination.city}
                            <span>({data.destination.iata} / {data.destination.icao})</span>
                        </p>
                        <span>{data.destination.name}</span>
                        <span>{data.destination.latitude}, {data.destination.longitude}</span>
                    </section>
                    {
                        data.times?.arrival &&
                        <section>
                            <p>{data.times.arrival.estimated ? data.times.arrival.estimated : data.times.arrival.actual} {data.times.arrival.timezone.short} - {data.times.arrival.relative}</p>
                            <span>Scheduled: {data.times.arrival.scheduled} {data.times.arrival.timezone.short}</span>
                        </section>
                    }
                    <section className='airport-info'>
                        <h3>Terminal</h3>
                        <h3>Gate</h3>
                        <h3>Runway</h3>
                        <p>{data.destination.terminal ?? '-'}</p>
                        <p>{data.destination.gate ?? '-'}</p>
                        <p>{data.destination.runway ?? '-'}</p>
                    </section>
                </article>
            }
            </div>
            <article>
                <h2>Transponder Info</h2>
                <section>
                    <h3>Location</h3>
                    <p>{data.latitude}, {data.longitude}</p>
                </section>
                <section>
                    <h3>Altitude</h3>
                    <p>{data.altitude} feet</p>
                </section>
                <section>
                    <h3>Heading</h3>
                    <p>{data.heading}°</p>
                </section>
                <section>
                    <h3>Ground Speed</h3>
                    <p>{data.groundSpeed} kts</p>
                </section>
                {
                    data.squawkCode &&
                    <section>
                        <h3>Squawk</h3>
                        <p>{data.squawkCode}</p>
                    </section>
                }
                {
                    data.route &&
                    <section>
                        <h3>Route</h3>
                        <p className='route'>{data.route}</p>
                    </section>
                }
                <section>
                    <h3>Progress</h3>
                    <p>{data.progress ?? 0}%</p>
                </section>
            </article>
            <article>
                <h2>Aircraft</h2>
                <section>
                    <h3>Aircraft Name</h3>
                    <p>{data.aircraft.name} ({data.aircraft.icao})</p>
                </section>
                <section>
                    <img src={data.aircraft.countryFlagImageUrl} alt={`${data.aircraft.country} flag`} />
                    <section>
                        <h3>Registration</h3>
                        <p>{data.aircraft.registration}</p>
                    </section>
                </section> 
                <section>
                    <h3>Airline</h3>
                    <p>{data.airline?.name} ({data.airline?.icao})</p>
                </section>
                <section>
                    <h3>ICAO 24-bit Address</h3>
                    <p>{data.aircraft.icao24BitAddress}</p>
                </section> 
                <section>
                    <h3>Serial Number</h3>
                    <p>{data.aircraft.serialNumber}</p>
                </section> 
                <section>
                    <h3>Age</h3>
                    <p>{data.aircraft.age}</p>
                </section> 
                <section>
                    <h3>Date of First Flight</h3>
                    <p>{data.aircraft.firstFlight}</p>
                </section>
                <section>
                    <h3>Type of Aircraft</h3>
                    <p>{data.aircraft.class}</p>
                </section>
                <section>
                {
                    data.images.length &&
                    <div className='aircraft-image'>
                        <img src={data.images[0].url} alt={`${data.aircraft.registration} from ${data.images[0].source}`} />
                        <a href={data.images[0].sourceUrl} target='_blank' rel='noreferrer'>{data.images[0].source}</a>
                    </div>
                }
                </section>
            </article>
            <article>
                <h2>Source</h2>
                <section>
                    <h3>Type</h3>
                    <p>{data.source.type}</p>
                </section>
                <section>
                    <h3>Station</h3>
                    <p>{data.source.station}</p>
                </section>
                <section>
                    <h3>Location</h3>
                    <p>{data.source.city}, {data.source.country}</p>
                    <p>{data.source.latitude}, {data.source.longitude}</p>
                </section>
                <section>
                    <h3>Distance</h3>
                    <p>{data.source.distance} mi</p>
                </section>
            </article>
        </div>
    );
}

export default Flight;