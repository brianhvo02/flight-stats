export interface LiveFlight {
    id: string;
    icaoAddress: string;
    latitude: number;
    longitude: number;
    track: number;
    calibratedAltitude: number;
    groundSpeed: number;
    squawk: string;
    status: string;
    aircraftType: string;
    registration: string;
    timestamp: Date;
    departureAirport: string;
    arrivalAirport: string;
    flightNumber: string;
    ground: boolean;
    verticalSpeed: number;
    callsign: string;
    unknown: number;
    icaoAirline: string;
}

export interface FlightInfo {
    identification: {
        id: string;
        row: number;
        number: {
            default: string;
            alternative: string | null;
        }
        callsign: string;
    }
    status: {
        live: boolean;
        text: string;
        icon: string;
        estimated: null;
        ambiguous: boolean;
        generic: {
            status: {
                text: string;
                color: string;
                type: string;
            }
            eventTime: {
                utc: number;
                local: number;
            }
        }
    }
    level: string;
    promote: boolean;
    aircraft: {
        model: {
            code: string;
            text: string;
        }
        countryId: number;
        registration: string;
        age: null;
        msn: null;
        images: {
            thumbnails: Image[];
            medium: Image[];
            large: Image[];
        } 
        hex: string;
    }
    airline: AirlineInfo;
    owner: null;
    airspace: null;
    airport: {
        origin: AirportInfo | null;
        destination: AirportInfo | null;
        real: Time | null;
    }
    flightHistory: {
        aircraft: FlightHistory[];
    }
    ems: null;
    availability: string[];
    time: {
        scheduled: Time;
        real: Time;
        estimated: Time;
        other: {
            eta: number;
            updated: number;
        }
        historical: {
            flighttime: string;
            delay: string;
        }
    }
    trail: TrailInfo[];
    firstTimestamp: number;
    s: string;
}

interface TrailInfo {
    lat: number;
    lng: number;
    alt: number;
    spd: number;
    ts: number;
    hd: number;
  }

interface Time {
    departure?: number | null;
    arrival?: number | null;
}

interface Code {
    iata: string;
    icao: string;
}

interface Image {
    src: string;
    link: string;
    copyright: string;
    source: string;
}

export interface AirlineInfo {
    name: string;
    short: string;
    code: Code;
    url: string;
}

interface AirportInfo {
    name: string;
    code: Code;
    position: {
        latitude: number;
        longitude: number;
        altitude: number;
        country: {
            id: number;
            name: string;
            code: string;
            codeLong: string;
        }
        region: {
            city: string;
        }
    }
    timezone: {
        name: string;
        offset: number;
        offsetHours: string;
        abbr: string;
        abbrName: string;
        isDst: boolean;
    }
    visible: boolean;
    website: string;
    info: {
        terminal: string;
        baggage: null;
        gate: string;
    }
}

interface FlightHistory {
    identification: {
        id: string;
        number: {
            default: string;
        }
        airport: {
            origin: AirportInfo;
            destination: AirportInfo;
        }
        time: {
            real: Time;
        }
    }
}
