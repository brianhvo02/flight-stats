import 'mapbox-gl/dist/mapbox-gl.css';
import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox/typed';
import { Layer } from '@deck.gl/core/typed'
import Map, { FullscreenControl, MapRef, NavigationControl, useControl } from 'react-map-gl';
import { RefObject } from 'react';

const DeckGLOverlay = (props: MapboxOverlayProps & { interleaved?: boolean; }) => {
    const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
    overlay.setProps(props);
    return null;
}

interface MapProps {
    style?: {
        width?: number | string;
        height?: number | string;
    }
    viewState?: {
        latitude?: number;
        longitude?: number;
        pitch?: number;
        zoom?: number;
        bearing?: number;
    }
    layers?: Layer[];
    mapRef: RefObject<MapRef>;
}

// 37.618889, -122.375

const DeckGLMap = (props: MapProps) => {
    const viewState = {
        latitude: 0, 
        longitude: 0,
        pitch: 0,
        zoom: 0,
        bearing: 0,
        ...(props.viewState ?? {})
    }
    const style = {
        width: '100%', 
        height: '100%',
        ...(props.style ?? {})
    }

    return (
        <Map
            initialViewState={viewState}
            mapStyle='mapbox://styles/mapbox/dark-v11'
            style={style}
            ref={props.mapRef}
        >
            <DeckGLOverlay layers={props.layers ?? []} />
            <NavigationControl />
            <FullscreenControl />
        </Map>
    );
}

export default DeckGLMap;