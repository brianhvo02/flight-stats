export interface Bounds {
    tl_y: number;
    tl_x: number;
    br_y: number;
    br_x: number;
    subzones?: Zones;
}

export default interface Zones {
    [key: string]: Bounds;
}