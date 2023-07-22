import _, { keys } from "lodash";
import LiveFlight from "../types/RadarBox/LiveFlight";
import FlightPosition from "../types/RadarBox/FlightPosition";
import FlightInfo from "../types/RadarBox/FlightInfo";

interface SearchOptions {
    bounds?: {
        lat1: number;
        lon1: number;
        lat2: number;
        lon2: number;
    }
    zoom?: number;
    flightNumber?: string;
}

export default class FlightData {
    data: LiveFlight[];
    selectedFlightId?: string;
    selectedFlightLive?: LiveFlight;
    selectedFlightInfo?: FlightInfo;
    selectedFlightPositions?: FlightPosition[];

    private options?: SearchOptions;

    private constructor(data: LiveFlight[], options?: SearchOptions) {
        this.data = data;
        this.options = options;
        // if (options.)
    }

    static async init(options?: SearchOptions) {
        const data = await this.getLiveFlights(options);
        return new FlightData(data, options);
    }

    async update() {
        const liveFlightsReq = FlightData.getLiveFlights(this.options);

        if (this.selectedFlightId) {
            const [ positions, info ] = await Promise.all([
                FlightData.getFlightPositions(this.selectedFlightId),
                FlightData.getFlightInfo(this.selectedFlightId)
            ]);

            this.selectedFlightPositions = positions;
            this.selectedFlightInfo = info;
        }
        
        this.data = await liveFlightsReq;
        
        if (this.selectedFlightId)
            this.selectedFlightLive = this.data.find(flight => flight.id === this.selectedFlightId);
    }

    async selectId(id: string) {
        this.selectedFlightId = id;
        await this.update();
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

            if (options.zoom)
                rawParams.zoom = options.zoom.toString();

            if (options.flightNumber)
                rawParams.fn = options.flightNumber;
        }

        const params = new URLSearchParams(rawParams);
    
        const data: LiveFlight[] = await fetch(`https://data.rb24.com/live?${params.toString()}`, {
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

    static async getLiveFlight(flightNumber: string) {
        const options = { flightNumber };
        const data = await this.getLiveFlights(options);
        const flightData = new FlightData(data, options);
        await flightData.selectId(data[0].id);
        return flightData;
    }

    private static getFlightPositions = async (id: string): Promise<FlightPosition[]> => fetch('https://data.rb24.com/live-route?fid=' + id, {
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

    private static getFlightInfo = async (id: string): Promise<FlightInfo> => fetch('https://data.rb24.com/live-flight-info?fid=' + id, {
        "headers": {
            "Origin": "https://www.radarbox.com"
        },
        "method": "GET"
    }).then(async res => {
        const raw = await res.json();
        // return raw;
        return {
            id: raw.fid,
            latitude: raw.la,
            longitude: raw.lo,
            timestamp: new Date(raw.svd),
            callsign: raw.cs,
            flightNumber: raw.fnia,
            images: raw.phs.map((ph: any) => ({
                source: ph.ph,
                sourceUrl: ph.phu,
                url: 'https://cdn.radarbox.com/photo/' + ph.th
            })),
            route: raw.route,
            altitude: raw.alt,
            squawkCode: raw.sq,
            heading: raw.hd,
            groundSpeed: raw.gs,
            progress: raw.pr,
            source: {
                type: raw.so,
                station: raw.st,
                city: raw.stci,
                country: raw.stco,
                latitude: raw.stconla,
                longitude: raw.stconlo,
                distance: raw.stdis
            },
            airline: {
                icao: raw.alic,
                iata: raw.alia,
                name: raw.alna,
                imageUrl: `https://cdn.radarbox.com/airlines/sq/${raw.icao}.png`
            },
            origin: {
                latitude: raw.aporgla,
                longitude: raw.aporglo,
                icao: raw.aporgic,
                iata: raw.aporgia,
                name: raw.aporgna,
                city: raw.aporgci,
                terminal: raw.depterm,
                gate: raw.depgate,
                runway: raw.tkorw
            },
            destination: {
                latitude: raw.apdstla,
                longitude: raw.apdstlo,
                icao: raw.apdstic,
                iata: raw.apdstia,
                name: raw.apdstna,
                city: raw.apdstci,
                terminal: raw.arrterm,
                gate: raw.arrgate,
                runway: raw.lngrw
            },
            aircraft: {
                icao: raw.act,
                name: raw.acd,
                unknown: raw.accl,
                registration: raw.acr,
                icao24BitAddress: raw.ms,
                serialNumber: raw.accn,
                age: raw.acff,
                firstFlight: raw.acffdate,
                country: raw.accountry
            },
            times: {
                departure: {
                    scheduled: raw.deps,
                    estimated: raw.depe,
                    actual: raw.depa,
                    relative: raw.departureRelative,
                    timezone: {
                        short: raw.aporgtzns,
                        long: raw.aporgtznl,
                        offset: raw.aporgtz
                    }
                },
                arrival: {
                    scheduled: raw.arrs,
                    estimated: raw.arre,
                    actual: raw.arra,
                    relative: raw.arrivalRelative,
                    timezone: {
                        short: raw.apdsttzns,
                        long: raw.apdsttznl,
                        offset: raw.apdsttz
                    }
                },
                duration: raw.duration,
                delay: raw.delayed
            },
            status: raw.status,
            distance: raw.distance,
            ground: !!raw.ground,
            fir: raw.fir,
            daysOfOperation: raw.dooperation.map((n: number) => n - 1),
            seatMap: raw.seatmaps ? {
                link: raw.seatmaps.link,
                isWideBody: raw.seatmaps.isWideBody === '1',
                configuration: (() => {
                    const [ firstClass, business, premium, economy ] = raw.seatmaps.seatsConf.split('|');
                    return { firstClass, business, premium, economy };
                })()
            } : undefined
        };
    });
}