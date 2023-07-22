import _, { keys } from "lodash";
import LiveFlight from "../types/RadarBox/flight";
import FlightRoute from "../types/RadarBox/route";

interface SearchOptions {
    bounds?: {
        lat1: number;
        lon1: number;
        lat2: number;
        lon2: number;
    }
    zoom?: number;
}

export default class FlightData {
    data: LiveFlight[];

    private options?: SearchOptions;
    private selectedId?: string;

    private constructor(data: LiveFlight[], options?: SearchOptions) {
        this.data = data;
        this.options = options;
    }

    static async init(options?: SearchOptions) {
        const data = await this.getLiveFlights(options);
        return new FlightData(data, options);
    }

    async update() {
        const data = await FlightData.getLiveFlights(this.options);
        this.data = data;
    }

    selectId(id: string) {
        this.selectedId = id;
    }

    private static async getLiveFlights(options?: SearchOptions) {
        const rawParams: { [key: string]: string } = {
            // aircraft: '',
            // airport: '',
            // fn: '',
            // far: '',
            // fms: '',
            // zoom: '13',
            // flightid: '',
            // route: '',
            // bounds: '90,180,-90,-180',
            // designator: 'iata',
            // showLastTrails: 'true',
            // tz: 'local',
            vehicles: 'true',
            // ff: 'false',
            // os: 'web',
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
            // diverted: 'false',
            // delayed: 'false',
            ground: 'true',
            onair: 'true',
            // blocked: 'false',
            // station: '',
            // airline: '',
            // route: '',
            // squawk: '',
            // country: '',
            // durationFrom: '0',
            // durationTo: '14',
            // distanceFrom: '0',
            // distanceTo: '16000'
        };

        if (options) {
            if (options.bounds)
                rawParams.bounds = `${options.bounds.lat2},${options.bounds.lon2},${options.bounds.lat1},${options.bounds.lon1}`;

            if (options.zoom) {
                rawParams.zoom = options.zoom.toString();
            }
        }

        const params = new URLSearchParams(rawParams);
    
        const data = await fetch(`https://data.rb24.com/live?${params.toString()}`, {
            "headers": {
                "Origin": "https://www.radarbox.com"
            },
            "method": "GET"
        }).then(async res => {
            const raw = await res.json();
            // console.log(raw)
            return Object.entries(raw[0]).map(([id, info]: [string, any]) => {
                // if (info[0] === 'QR8981')
                //     console.log(info)
    
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

                obj.airlineImageUrl = `https://cdn.radarbox.com/airlines/sq/${obj.airline}.png`;
    
                delete obj.actualDeparture;
                delete obj.estimatedArrival;
                delete obj.originCoordinates;
                delete obj.destinationCoordinates;
                delete obj.imageSlug;
    
                obj.timestamp = new Date(obj.timestamp);
                obj.id = id;
                return obj;
            });
        });

        return data;
    }

    static getRoute = async (id: string): Promise<FlightRoute[]> => fetch('https://data.rb24.com/live-route?fid=' + id, {
        "headers": {
            "Origin": "https://www.radarbox.com"
        },
        "method": "GET"
    }).then(async res => {
        const { pos } = await res.json();
        return Object.entries(pos)
            .sort((a: [string, any], b: [string, any]) => a[0].localeCompare(b[0]))
            .map(([timestamp, data]: [string, any]) => ({
                timestamp: new Date(parseInt(timestamp) * 1000),
                latitude: data[0],
                longitude: data[1],
                altitude: parseInt(data[2]) || 0,
                speed: parseInt(data[3]) || 0,
                source: data[4]
            }));
    });
}