export enum InfoSource {
    'MLAT',
    'ADSB',
    'UAT',
    'ASDEX',
    'SATE',
    'FLARM',
    'ASDI',
    'OCEA',
    'HFDL',
    'AUST'
}

export default interface FlightLive {
    id: string;
    flightNumber: string;
    latitude: number;
    longitude: number;
    timestamp: number;
    altitude: number | null;
    model: string;
    groundSpeed: number | '';
    heading: number | '';
    source: InfoSource;
    registration: string;
    origin: Airport;
    destination: Airport;
    airline: string;
    verticalSpeed: number | '';
    station: string;
    status: string | null;
    onGround: boolean;
    aircraftStatus: string | null;
    squawk: number | '';
    imageUrl?: string;
    airlineImageUrl?: string;
    divertedAirport: string | null;
    estimatedDistanceRemaining: number | null;
    estimatedTimeRemaining: string | null;
    icao24BitAddress: string;
}

interface Airport {
    iata: string;
    departureTime?: string | null;
    estimatedArrival?: string | null;
    coordinates: {
        latitude?: number;
        longitude?: number;
    }
}