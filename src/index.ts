// import _ from 'lodash';
// import { viewport, bounds } from '@mapbox/geo-viewport';
// import FlightData from './RadarBox/FlightData';
// import FlightInfo, { AircraftClass } from './types/RadarBox/FlightInfo';

// (async () => {
//     console.log(viewport([-122.033, 37.314, -121.813, 37.405], [3840, 2160], 2, 23, 512, true));
//     const [lon1, lat1, lon2, lat2] = bounds([-121.91385, 37.34807], 9, [3840, 2160], 512);

//     const flightData = await FlightData.init({
//         bounds: { lat1, lon1, lat2, lon2 },
//         zoom: 14,
//         airport: 'KSFO',
//         aircraftClass: AircraftClass.MILITARY
//         airline: 'DAL'
//     });

//     const flightData = await FlightData.getLiveFlight('MP6161');

//     if (flightData) {
//         console.log(flightData.data.length)
//         const chunks = await flightData.getAllFlightInfo();
//         console.table(flightData.data.map(f => _.pick(f, ['id', 'flightNumber', 'airline', 'model'])));
//         console.table(_.countBy(chunks.map(f => f.airline), 'name'));
//         console.table(chunks.map(f => ({
//             ..._.pick(f, ['id', 'flightNumber', 'progress', 'altitude']),
//             airline: f.airline?.name,
//             origin: f.origin?.city,
//             destination: f.destination?.city,
//             aircraft: f.aircraft.icao
//         })));
//         await flightData.selectId('2002902353');
//         console.log(flightData.selectedFlightInfo)
//         await flightData.selectId(flightData.data[0].id);
//         console.log(flightData.selectedFlightLive?.flightNumber)
//         console.log(flightData.selectedFlightInfo?.latitude, flightData.selectedFlightInfo?.longitude);
//         flightData.startUpdate(6000);
//     }
// })();