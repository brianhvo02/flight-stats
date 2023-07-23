import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import FlightLive from '../types/FlightLive';
import FlightInfo, { AircraftClass } from '../types/FlightInfo';
import _ from 'lodash';

interface LiveFlightOptions {
    bounds?: {
        lat1: number;
        lon1: number;
        lat2: number;
        lon2: number;
    }
    zoom?: number;
    flightNumber?: string;
    airport?: string;
    aircraftClass?: AircraftClass;
    airline?: string;
}

const liveFlightsQuery = (options: LiveFlightOptions) => {
    const rawParams: { [key: string]: string } = {
        adsb: 'true',
        adsbsat: 'true',
        asdi: 'true',
        ocea: 'true',
        mlat: 'true',
        sate: 'true',
        uat: 'true',
        hfdl: 'true',
        esti: 'true',
        asdex: 'true',
        flarm: 'true',
        aust: 'true',
        ground: 'true',
        onair: 'true',
    };

    if (options) {
        if (options.bounds)
            rawParams.bounds = `${options.bounds.lat2},${options.bounds.lon2},${options.bounds.lat1},${options.bounds.lon1}`;

        if (options.zoom)
            rawParams.zoom = options.zoom.toString();

        if (options.flightNumber)
            rawParams.fn = options.flightNumber;

        if (options.airport)
            rawParams.airport = options.airport;

        if (options.airline)
            rawParams.airline = options.airline;

        if (options.aircraftClass)
            rawParams['class[]'] = options.aircraftClass;
    }

    const params = new URLSearchParams(rawParams);
    return '/live?' + params.toString();
}

const liveFlightsTransform = (res: any) => {
    return Object.entries(res[0]).map(([id, info]: [string, any]) => {    
        const keys = [
            'flightNumber', 'latitude', 'longitude', 'timestamp', 
            'altitude', 'model', 'groundSpeed', 'heading', 
            'source', 'registration', 'origin', 'destination', 'airline', 'verticalSpeed', 'station', 'status', 'onGround',
            'originCoordinates', 'destinationCoordinates', 'aircraftStatus', 'squawk', 'estimatedArrival', 'imageSlug', 'actualDeparture',
            'divertedAirport', 'estimatedDistanceRemaining', 'estimatedTimeRemaining', 'icao24BitAddress'
        ];

        if (info[8] === 'ESTI') {
            keys[8] = 'station';
            keys[14] = 'status';
            keys[15] = 'source';
        }

        const obj: any = _.zipObject(keys, info);

        obj.origin = {
            iata: obj.origin,
            departureTime: obj.actualDeparture,
            coordinates: {
                latitude: obj.originCoordinates?.[1],
                longitude: obj.originCoordinates?.[0]
            }
        };

        obj.destination = {
            iata: obj.destination,
            estimatedArrival: obj.estimatedArrival,
            coordinates: {
                latitude: obj.destinationCoordinates?.[1],
                longitude: obj.destinationCoordinates?.[0]
            }
        };
        
        if (obj.imageSlug.length > 0)
            obj.imageUrl = 'https://cdn.radarbox.com/photo/' + obj.imageSlug;

        obj.airlineImageUrl = obj.airline.length ? `https://cdn.radarbox.com/airlines/sq/${obj.airline}.png` : undefined;

        delete obj.actualDeparture;
        delete obj.estimatedArrival;
        delete obj.originCoordinates;
        delete obj.destinationCoordinates;
        delete obj.imageSlug;

        obj.id = id;
        return obj as FlightLive;
    });
}

const flightInfoTransform = (res: any) => ({
    id: res.fid,
    latitude: res.la,
    longitude: res.lo,
    timestamp: res.svd,
    callsign: res.cs,
    flightNumber: res.fnia,
    images: res.phs.map((ph: any) => ({
        source: ph.phu,
        sourceUrl: ph.ph,
        url: 'https://cdn.radarbox.com/photo/' + ph.th
    })),
    route: res.route,
    altitude: res.alt,
    squawkCode: res.sq,
    heading: res.hd,
    groundSpeed: res.gs,
    progress: res.pr,
    source: {
        type: res.so,
        station: res.st,
        city: res.stci,
        country: res.stco,
        latitude: res.stconla,
        longitude: res.stconlo,
        distance: res.stdis
    },
    airline: res.alic ? {
        icao: res.alic,
        iata: res.alia,
        name: res.alna,
        imageUrl: `https://cdn.radarbox.com/airlines/${res.alic}.png`
    } : undefined,
    origin: res.aporgna ? {
        latitude: res.aporgla,
        longitude: res.aporglo,
        icao: res.aporgic,
        iata: res.aporgia,
        name: res.aporgna,
        city: res.aporgci,
        terminal: res.depterm,
        gate: res.depgate,
        runway: res.tkorw
    } : undefined,
    destination: res.apdstna ? {
        latitude: res.apdstla,
        longitude: res.apdstlo,
        icao: res.apdstic,
        iata: res.apdstia,
        name: res.apdstna,
        city: res.apdstci,
        terminal: res.arrterm,
        gate: res.arrgate,
        runway: res.lngrw
    } : undefined,
    aircraft: {
        icao: res.act,
        name: res.acd,
        class: res.accl,
        registration: res.acr,
        icao24BitAddress: res.ms,
        serialNumber: res.accn,
        age: res.acff,
        firstFlight: res.acffdate,
        country: res.accountry,
        countryFlagImageUrl: res.accountry
            ? `https://cdn.radarbox.com/countries-rect/${res.accountry.toLowerCase()}.png`
            : undefined
    },
    times: (
        (
            res.deps || res.depe || res.depa
        ) || (
            res.arrs || res.arre || res.arra
        )
    ) ? {
        departure: (res.deps || res.depe || res.depa) ? {
            scheduled: res.deps,
            estimated: res.depe,
            actual: res.depa,
            relative: res.departureRelative,
            timezone: {
                short: res.aporgtzns,
                long: res.aporgtznl,
                offset: res.aporgtz
            }
        } : undefined,
        arrival: (res.arrs || res.arre || res.arra) ? {
            scheduled: res.arrs,
            estimated: res.arre,
            actual: res.arra,
            relative: res.arrivalRelative,
            timezone: {
                short: res.apdsttzns,
                long: res.apdsttznl,
                offset: res.apdsttz
            }
        } : undefined,
        duration: res.duration,
        delay: res.delayed
    } : undefined,
    status: res.status,
    distance: res.distance,
    ground: !!res.ground,
    fir: res.fir,
    daysOfOperation: res.dooperation ? res.dooperation.map((n: number) => n - 1) : undefined,
    seatMap: res.seatmaps ? {
        link: res.seatmaps.link,
        isWideBody: res.seatmaps.isWideBody === '1',
        configuration: (() => {
            const [ first, business, premium, economy ] = res.seatmaps.seatsConf.split('|');
            return { first, business, premium, economy };
        })()
    } : undefined
});

const flightDataApi = createApi({
    reducerPath: 'flightDataApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://data.rb24.com', 
        headers: {
            'Origin': 'https://www.radarbox.com'
        } 
    }),
    endpoints: builder => ({
        getLiveFlights: builder.query<FlightLive[], LiveFlightOptions>({
            query: liveFlightsQuery,
            transformResponse: liveFlightsTransform
        }),
        getFlightInfo: builder.query<FlightInfo, string>({
            query: fid => '/live-flight-info?fid=' + fid,
            transformResponse: flightInfoTransform
        })
    })
});

export const { useGetLiveFlightsQuery, useGetFlightInfoQuery } = flightDataApi;
export default flightDataApi;