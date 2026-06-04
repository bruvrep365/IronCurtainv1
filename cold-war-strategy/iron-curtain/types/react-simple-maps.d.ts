declare module 'react-simple-maps' {
  import { FC, ReactNode, CSSProperties, MouseEvent } from 'react';

  export interface Geo {
    rsmKey: string;
    id: string;
    properties: Record<string, unknown>;
  }

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: Record<string, number | string | number[]>;
    width?: number;
    height?: number;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
  }

  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    children?: ReactNode;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: Geo[] }) => ReactNode;
  }

  export interface GeographyStyleSet {
    default?: CSSProperties;
    hover?: CSSProperties;
    pressed?: CSSProperties;
  }

  export interface GeographyProps {
    geography: Geo;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: GeographyStyleSet;
    onClick?: (geo: Geo, evt: MouseEvent) => void;
    onMouseEnter?: (geo: Geo, evt: MouseEvent) => void;
    onMouseLeave?: (geo: Geo, evt: MouseEvent) => void;
    className?: string;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
  }

  export const ComposableMap: FC<ComposableMapProps>;
  export const ZoomableGroup: FC<ZoomableGroupProps>;
  export const Geographies: FC<GeographiesProps>;
  export const Geography: FC<GeographyProps>;
  export const Marker: FC<MarkerProps>;
}
