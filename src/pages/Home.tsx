import './Home.scss';
import { MouseEvent, useState } from 'react';
import { useGetLiveFlightsQuery } from '../store/flightData';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import FlightLive from '../types/FlightLive';

const Home = () => {
    const navigate = useNavigate();
    const [sort, setSort] = useState('id')
    const { data, isLoading } = useGetLiveFlightsQuery({
        airport: 'KSFO'
    }, {
        pollingInterval: 6000
    });

    const handleClick = (e: MouseEvent<HTMLTableRowElement>) => navigate('/flights/' + e.currentTarget.id);
    const handleHeaderClick = (e: MouseEvent<HTMLTableCellElement>) => setSort(e.currentTarget.id);

    const flightSort = (a: FlightLive, b: FlightLive) => {
        const valA = _.get(a, sort);
        const valB = _.get(b, sort);

        if (!valA && !valB)
            return 0;
        if (!valA)
            return -1;
        if (!valB)
            return 1;

        if (['latitude', 'longitude'].includes(sort))
            return valA - valB;

        return valA.localeCompare(valB);
    }

    if (isLoading)
        return <p>Loading...</p>;

    if (!data)
        return <p>No data.</p>

    return (
        <table>
            <thead>
                <tr>
                    <th id='id' onClick={handleHeaderClick}>
                        Identifier {sort === 'id' && '▼'}
                    </th>
                    <th id='flightNumber' onClick={handleHeaderClick}>
                        Flight Number {sort === 'flightNumber' && '▼'}
                    </th>
                    <th id='origin.iata' onClick={handleHeaderClick}>
                        Origin {sort === 'origin.iata' && '▼'}
                    </th>
                    <th id='destination.iata' onClick={handleHeaderClick}>
                        Destination {sort === 'destination.iata' && '▼'}
                    </th>
                    <th id='latitude' onClick={handleHeaderClick}>
                        Latitude {sort === 'latitude' && '▼'}
                    </th>
                    <th id='longitude' onClick={handleHeaderClick}>
                        Longitude {sort === 'longitude' && '▼'}
                    </th>
                    <th id='origin.departureTime' onClick={handleHeaderClick}>
                        Departure Time {sort === 'origin.departureTime' && '▼'}
                    </th>
                    <th id='destination.estimatedArrival' onClick={handleHeaderClick}>
                        Estimated Arrival {sort === 'destination.estimatedArrival' && '▼'}
                    </th>
                </tr>
            </thead>
            <tbody>{
                [...data].sort(flightSort).map(flight => 
                    <tr key={flight.id} id={flight.id} onClick={handleClick}>
                        <td>{flight.id}</td>
                        <td className='flight-number'>
                            <img src={flight.airlineImageUrl} alt={`${flight.airline} logo`} />
                            <span>{flight.flightNumber}</span>
                        </td>
                        <td>{flight.origin.iata}</td>
                        <td>{flight.destination.iata}</td>
                        <td>{flight.latitude}</td>
                        <td>{flight.longitude}</td>
                        <td>{flight.origin.departureTime}</td>
                        <td>{flight.destination.estimatedArrival}</td>
                    </tr>
                )
            }</tbody>
        </table>
    )
}

export default Home;