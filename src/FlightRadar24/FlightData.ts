import _, { keys } from "lodash";
import Zones, { Bounds } from "../types/FlightRadar24/zone";
import { AirlineInfo, FlightInfo, LiveFlight } from "../types/FlightRadar24/flight";

export default class FlightData {
    zones: Zones;
    bounds?: Bounds;

    private constructor(zones: Zones, bounds?: Bounds) {
        this.zones = zones;
        this.bounds = bounds;
    }

    static async init(zone?: string) {
        const zones = await this.getZones();
        if (zone) {
            const bounds = _.get(zones, zone.replaceAll('/', '.subzones.'), undefined);
            if (!bounds)
                throw new Error('Zone does not exist.');

            return new this(zones, bounds);
        }

        return new this(zones);
    }

    static getZones = async (): Promise<Zones> => fetch('https://www.flightradar24.com/js/zones.js.php').then(res => res.json());

    async getFeed(): Promise<LiveFlight[]> {
        const keys = [
            'icaoAddress', 'latitude', 'longitude', 'track', 'calibratedAltitude', 'groundSpeed', 'squawk',
            'status', 'aircraftType', 'registration', 'timestamp', 'departureAirport', 'arrivalAirport',
            'flightNumber', 'ground', 'verticalSpeed', 'callsign', 'unknown', 'icaoAirline'
        ];

        return fetch(`https://data-cloud.flightradar24.com/zones/fcgi/feed.js${this.bounds ? `?bounds=${this.bounds.tl_y},${this.bounds.br_y},${this.bounds.tl_x},${this.bounds.br_x}` : ''}`)
            .then(res => res.json())
            .then(raw => {
                delete raw.version;
                delete raw.full_count;
                return Object.entries(raw).map(([id, info]: [string, any]) => {
                    const obj: any = _.zipObject(keys, info);
                    obj.ground = obj.ground === 1;
                    obj.timestamp = new Date(obj.timestamp * 1000);
                    obj.id = id;
                    return obj;
                });
            });
    }

    static getFlight = async (id: string): Promise<FlightInfo> => fetch(`https://data-live.flightradar24.com/clickhandler?flight=${id}`).then(res => res.json());
    static getAirlineLogo = async (info: AirlineInfo): Promise<Buffer> => fetch(
        `https://cdn.flightradar24.com/assets/airlines/logotypes/${info.code.iata}_${info.code.icao}.png`
    ).then(res => res.arrayBuffer()).then(buf => Buffer.from(buf));
}