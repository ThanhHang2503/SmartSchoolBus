declare module 'leaflet-routing-machine';

declare namespace L {
  namespace Routing {
    function control(options?: any): any;
    const osrm: any;
    const mapbox: any;
  }
}

export {};