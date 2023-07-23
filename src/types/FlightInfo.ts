export default interface FlightInfo {
    id: string;
    latitude: number;
    longitude: number;
    timestamp: number;
    callsign: string;
    flightNumber?: string;
    images: {
        source: string;
        sourceUrl: string;
        url: string;
    }[]
    route?: string;
    altitude: number;
    squawkCode?: number;
    heading: number;
    groundSpeed: number;
    progress?: number;
    source: {
        type: string;
        station: string;
        city?: string;
        country?: string;
        latitude?: number;
        longitude?: number;
        distance?: number;
    }
    airline?: {
        icao: string;
        iata?: string;
        name: string;
        imageUrl: string;
    }
    origin?: Airport;
    destination?: Airport;
    aircraft: {
        icao: string;
        name: string;
        class?: AircraftClass;
        registration: string;
        icao24BitAddress: string;
        serialNumber?: string;
        age?: string;
        firstFlight?: string;
        country?: string;
        countryFlagImageUrl?: string;
    };
    times?: {
        departure?: Times;
        arrival?: Times;
        duration?: string;
        delay?: number;
    };
    status?: string;
    distance?: number;
    ground: boolean;
    fir: string;
    daysOfOperation?: DaysOfOperation[];
    seatMap?: {
        link: string;
        isWideBody: boolean;
        configuration: { 
            first: number; 
            business: number; 
            premium: number; 
            economy: number;
        }
    }
}

interface Airport {
    latitude: number;
    longitude: number;
    icao: string;
    iata: string;
    name: string;
    city: string;
    terminal?: string;
    gate?: string;
    runway?: string;
}

interface Times {
    scheduled?: string;
    estimated?: string;
    actual?: string;
    relative: string;
    timezone: {
        short: string;
        long: string;
        offset: string;
    }
}

enum DaysOfOperation {
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT'
}

export enum AircraftClass {
    AIRLINER = 'A',
    CARGO = 'AC',
    BUSINESS_JET = 'B',
    GENERAL_AVIATION = 'G',
    HELICOPTER = 'HG',
    MILITARY = 'M'
}