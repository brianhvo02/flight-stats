// import _ from 'lodash';
// import FlightData from './FlightRadar24/FlightData';
// import FlightData from './RadarBox/FlightData';
// import { viewport, bounds } from '@mapbox/geo-viewport';
// import FlightInfo, { AircraftClass } from './types/RadarBox/FlightInfo';

// (async () => {
    // const flightData = await FlightData.init('northamerica/na_c/na_cla');
    // const feed = await flightData.getFeed();
    // const flight = await FlightData.getFlight(feed[0].id);
    // const logo = await FlightData.getAirlineLogo(flight.airline);

    // console.table(feed.slice(0, 10).map(flight => _.pick(flight, ['id', 'aircraftType', 'callsign', 'latitude', 'longitude', 'departureAirport', 'arrivalAirport', 'calibratedAltitude', 'groundSpeed', 'ground'])));
    
    // const topTen = await Promise.all(feed.slice(0, 10).map(flight => FlightData.getFlight(flight.id)));
    // console.table(topTen.map(flight => ({
    //     id: flight.identification.id,
    //     callsign: flight.identification.callsign,
    //     text: flight.status.text,
    //     airline: flight.airline.short,
    //     origin_name: flight.airport.origin?.code.icao,
    //     origin_city: flight.airport.origin?.position.region.city,
    //     origin_terminal: flight.airport.origin?.info.terminal,
    //     origin_gate: flight.airport.origin?.info.gate,
    //     destination_name: flight.airport.destination?.code.icao,
    //     destination_city: flight.airport.destination?.position.region.city,
    //     destination_terminal: flight.airport.destination?.info.terminal,
    //     destination_gate: flight.airport.destination?.info.gate,
    // })));

    // console.log(viewport([-122.033, 37.314, -121.813, 37.405], [3840, 2160], 2, 23, 512, true));
    // const [lon1, lat1, lon2, lat2] = bounds([-121.91385, 37.34807], 9, [3840, 2160], 512);

    // const flightData = await FlightData.init({
        // bounds: { lat1, lon1, lat2, lon2 },
        // zoom: 14,
        // airport: 'KSFO',
        // aircraftClass: AircraftClass.MILITARY
        // airline: 'DAL'
    // });

    // const flightData = await FlightData.getLiveFlight('MP6161');

    // if (flightData) {
        // console.log(flightData.data.length)
        // const chunks = await flightData.getAllFlightInfo();
        // console.table(flightData.data.map(f => _.pick(f, ['id', 'flightNumber', 'airline', 'model'])));
        // console.table(_.countBy(chunks.map(f => f.airline), 'name'));
        // console.table(chunks.map(f => ({
        //     ..._.pick(f, ['id', 'flightNumber', 'progress', 'altitude']),
        //     airline: f.airline?.name,
        //     origin: f.origin?.city,
        //     destination: f.destination?.city,
        //     aircraft: f.aircraft.icao
        // })));
        // await flightData.selectId('2002902353');
        // console.log(flightData.selectedFlightInfo)
        // await flightData.selectId(flightData.data[0].id);
        // console.log(flightData.selectedFlightLive?.flightNumber)
        // console.log(flightData.selectedFlightInfo?.latitude, flightData.selectedFlightInfo?.longitude);
        // flightData.startUpdate(6000);
    // }

    
    
    // const flightData = await FlightData.getLiveFlight('K49700');
    // if (flightData)
    //     console.log(flightData.selectedFlightInfo)

    // const flight = flightData.data.find(x => x.flightNumber === 'AS3305');
    // await flightData.update();
    // console.log(flightData.data.find(x => x.flightNumber === 'WN1317'));
    
    // console.log(`https://www.google.com/maps/search/?api=1&query=${data[0].latitude},${data[0].longitude}`)
// })();