declare module 'supercluster' {
  import { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson';

  interface SuperclusterOptions<PropType = any> {
    minZoom?: number;
    maxZoom?: number;
    radius?: number;
    extent?: number;
    nodeSize?: number;
    log?: boolean;
    map?: (props: PropType) => any;
    reduce?: (accumulated: any, props: PropType) => void;
  }

  interface ClusterProperties extends GeoJsonProperties {
    cluster: true;
    cluster_id: number;
    point_count: number;
    point_count_abbreviated: string;
  }

  class Supercluster<PropType = any> {
    constructor(options?: SuperclusterOptions<PropType>);
    load(points: Feature<Point, PropType>[]): this;
    getClusters(
      bbox: [number, number, number, number],
      zoom: number
    ): Array<Feature<Point, PropType | ClusterProperties>>;
    getChildren(clusterId: number): Feature<Point, PropType>[];
    getLeaves(clusterId: number, limit?: number, offset?: number): Feature<Point, PropType>[];
    getTile(zoom: number, x: number, y: number): {
      features: Feature<Point, PropType | ClusterProperties>[];
      x: number;
      y: number;
      z: number;
    };
  }

  export default Supercluster;
}
