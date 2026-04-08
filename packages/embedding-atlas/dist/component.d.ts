import { Coordinator } from '@uwdata/mosaic-core';
import { Selection as Selection_2 } from '@uwdata/mosaic-core';

declare interface Cache_2 {
    get: (key: string) => Promise<any | null>;
    set: (key: string, value: any) => Promise<void>;
}

export declare type CustomComponent<N, P> = {
    class: CustomComponentClass<N, P & any>;
    props?: Record<string, any>;
} | CustomComponentClass<N, P>;

declare type CustomComponentClass<N, P> = new (node: N, props: P) => {
    update?: (props: P) => void;
    destroy?: () => void;
};

export declare type DataField = string | {
    sql: string;
};

export declare interface DataPoint {
    x: number;
    y: number;
    category?: number;
    text?: string;
    identifier?: DataPointID;
    fields?: Record<string, any>;
}

export declare type DataPointID = string | number | bigint;

export declare function defaultCategoryColors(count: number): string[];

export declare class EmbeddingView {
    private component;
    private currentProps;
    constructor(target: HTMLElement, props: EmbeddingViewProps);
    update(props: Partial<EmbeddingViewProps>): void;
    destroy(): void;
}

export declare interface EmbeddingViewConfig {
    /** Color scheme. */
    colorScheme?: "light" | "dark" | null;
    /** View mode. */
    mode?: "points" | "density" | null;
    /** Minimum average density for density contours to show up.
     * The density is measured as number of points per square points (aka., px in CSS units). */
    minimumDensity?: number | null;
    /** Override the automatically calculated point size.
     * If not specified, point size is calculated based on density. */
    pointSize?: number | null;
    /** Generate labels automatically.
     * By default labels are generated automatically if the `labels` prop is not specified,
     * and a `text` column is specified in the Mosaic view,
     * or a `queryClusterLabels` callback is specified in the non-Mosaic view.
     * Set this to `false` to disable automatic labels. */
    autoLabelEnabled?: boolean | null;
    /** The density threshold to filter the clusters before generating automatic labels.
     * The value is relative to the max density. */
    autoLabelDensityThreshold?: number | null;
    /** The stop words for automatic label generation. By default use NLTK stop words. */
    autoLabelStopWords?: string[] | null;
    /** Approximate maximum number of points to render when downsampling is active.
     * Points are sampled with bias toward sparse regions (fewer points kept in dense areas).
     * The sampling probability is given by this formula:
     * P(i) = (downsampleMaxPoints / numPointsInViewport) * (2 / (1 + density(p_i) / maxDensity * downsampleDensityWeight))
     * Default: 4,000,000. Set to null or Infinity to disable downsampling. */
    downsampleMaxPoints?: number | null;
    /** Density weight for downsampling (0-10).
     * Higher values mean more aggressive culling in dense areas.
     * Default: 5 */
    downsampleDensityWeight?: number | null;
}

export declare class EmbeddingViewMosaic {
    private component;
    private currentProps;
    constructor(target: HTMLElement, props: EmbeddingViewMosaicProps);
    update(props: Partial<EmbeddingViewMosaicProps>): void;
    destroy(): void;
}

export declare interface EmbeddingViewMosaicProps {
    /** The Mosaic coordinator.
     *  If not specified, the default coordinator from Mosaic's `coordinator()` method will be used. */
    coordinator?: Coordinator;
    /** The data table name. */
    table: string;
    /** The x column name. */
    x: string;
    /** The y column name. */
    y: string;
    /** The name of the category column.
     *  The categories should be represented as integers starting from 0.
     *  If you have categories represented as strings, you should first convert them to 0-indexed integers. */
    category?: string | null;
    /** The name of the text column.
     *  If specified, the default tooltip shows the text content.
     *  The text content is also used to generate labels automatically. */
    text?: string | null;
    /** The name of the identifier (aka., id) column.
     *  If specified, the `selection` object will contain an `identifier` property that you can use to identify the point. */
    identifier?: string | null;
    /** Additional fields for the tooltip data element.
     *  Each field can be specified as a column name or a SQL expression. */
    additionalFields?: Record<string, DataField> | null;
    /** The colors for the categories.
     *  Category `i` will use the `i`-th color from this list.
     *  If not specified, default colors will be used. */
    categoryColors?: string[] | null;
    /** A Mosaic `Selection` object to filter the contents of this view. */
    filter?: Selection_2 | null;
    /** Labels to display on the embedding view.
     *  Each label must have `x`, `y`, and `text` properties,
     *  and optionally `level` and `priority`. */
    labels?: Label[] | null;
    /** The width of the view. */
    width?: number | null;
    /** The height of the view. */
    height?: number | null;
    /** The pixel ratio of the view. */
    pixelRatio?: number | null;
    /** Configure the theme of the view. */
    theme?: ThemeConfig | null;
    /** Configure the embedding view. */
    config?: EmbeddingViewConfig | null;
    /** The viewport state.
     *  You may use this to share viewport state across multiple views.
     *  If undefined or set to `null`, the view will use a default viewport state.
     *  To listen to viewport state change, use `onViewportState`. */
    viewportState?: ViewportState | null;
    /** The current tooltip.
     *  The tooltip is an object with the following fields: `x`, `y`, `category`,
     *  `text`, `identifier`.
     *
     *  You may pass the identifier for the data point (`DataPointID`), or a `DataPoint`
     *  object, or a Mosaic `Selection`. If an id or a `DataPoint` object is specified,
     *  you will need to use `onTooltip` to listen to tooltip changes; if a Mosaic
     *  `Selection` is used, the selection will be updated when tooltip is triggered.
     */
    tooltip?: Selection_2 | DataPoint | DataPointID | null;
    /** The current single or multiple point selection.
     *
     *  You may pass an array of `DataPointID` or `DataPoint` objects, or a Mosaic
     *  `Selection`. If `DataPointID[]` or `DataPoint[]` is specified, you will need
     *  to use `onSelection` to listen to selection changes; if a Mosaic `Selection`
     *  is used, the selection will be updated with the appropriate predicates. */
    selection?: Selection_2 | DataPoint[] | DataPointID[] | null;
    /** A Mosaic `Selection` object to capture the component's range selection. */
    rangeSelection?: Selection_2 | null;
    /** The rectangle or polygon that drives the range selection. Setting this
     *  changes the current range selection and also affects the selection passed
     *  in `rangeSelection`. Use `onRangeSelection` to listen for changes to this
     *  rectangle. */
    rangeSelectionValue?: Rectangle | Point[] | null;
    /** A callback for when `viewportState` changes. */
    onViewportState?: ((value: ViewportState) => void) | null;
    /** A callback for when `tooltip` changes. */
    onTooltip?: ((value: DataPoint | null) => void) | null;
    /** A callback for when `selection` changes. */
    onSelection?: ((value: DataPoint[] | null) => void) | null;
    /** A callback for when `rangeSelection` changes. */
    onRangeSelection?: ((value: Rectangle | Point[] | null) => void) | null;
    /** A custom renderer to draw the tooltip content. */
    customTooltip?: CustomComponent<HTMLDivElement, {
        tooltip: DataPoint;
    }> | null;
    /** A custom renderer to draw overlay on top of the embedding view. */
    customOverlay?: CustomComponent<HTMLDivElement, {
        proxy: OverlayProxy;
    }> | null;
    /** A cache for intermediate results. */
    cache?: Cache_2 | null;
}

export declare interface EmbeddingViewProps {
    /** The data. */
    data: {
        /** An array of X coordinates, must be a `Float32Array`. */
        x: Float32Array<ArrayBuffer>;
        /** An array of Y coordinates, must be a `Float32Array`. */
        y: Float32Array<ArrayBuffer>;
        /** An array of category indices, must be a `Uint8Array`. */
        category?: Uint8Array<ArrayBuffer> | null;
    };
    /** The colors for the categories.
     *  Category `i` will use the `i`-th color from this list.
     *  If not specified, default colors will be used. */
    categoryColors?: string[] | null;
    /** Labels to display on the embedding view.
     *  Each label must have `x`, `y`, and `text` properties,
     *  and optionally `level` and `priority`. */
    labels?: Label[] | null;
    /** The width of the view. */
    width?: number | null;
    /** The height of the view. */
    height?: number | null;
    /** The pixel ratio of the view. */
    pixelRatio?: number | null;
    /** Configure the theme of the view. */
    theme?: ThemeConfig | null;
    /** Configure the embedding view. */
    config?: EmbeddingViewConfig | null;
    /** The viewport state.
     *  You may use this to share viewport state across multiple views.
     *  If undefined or set to `null`, the view will use a default viewport state.
     *  To listen to viewport state change, use `onViewportState`. */
    viewportState?: ViewportState | null;
    /** The current tooltip.
     *  The tooltip is an object with the following fields: `x`, `y`, `category`, `text`, `identifier`.
     *  To listen for a tooltip change, use `onTooltip`. */
    tooltip?: DataPoint | null;
    /** The current single or multiple point selection.
     *  Selection is triggered by clicking on the points (shift/cmd+click will toggle points).
     *  The selection is an array of objects with the following fields: `x`, `y`, `category`, `text`, `identifier`.
     *  To listen to selection change, use `onSelection`. */
    selection?: DataPoint[] | null;
    /** A rectangle or a polygon (list of points) that represents the range selection.
     *  If the value is a list of points, it is interpreted as a lasso selection
     *  with a closed polygon with the list of points as vertices. */
    rangeSelection?: Rectangle | null;
    /** A callback for when `viewportState` changes. */
    onViewportState?: ((value: ViewportState) => void) | null;
    /** A callback for when `tooltip` changes. */
    onTooltip?: ((value: DataPoint | null) => void) | null;
    /** A callback for when `selection` changes. */
    onSelection?: ((value: DataPoint[] | null) => void) | null;
    /** A callback for when `rangeSelection` changes. */
    onRangeSelection?: ((value: Rectangle | Point[] | null) => void) | null;
    /** An async function that returns a data point near the given (x, y) location.
     *  The `unitDistance` parameter is the distance of a single pixel in data domain.
     *  You can use this to determine the distance threshold for selecting a point. */
    querySelection?: ((x: number, y: number, unitDistance: number) => Promise<DataPoint | null>) | null;
    /** An async function that returns labels for a list of clusters.
     *  Each cluster is given as a list of rectangles that approximately cover the region. */
    queryClusterLabels?: ((clusters: Rectangle[][]) => Promise<(string | null)[]>) | null;
    /** A custom renderer to draw the tooltip content. */
    customTooltip?: CustomComponent<HTMLDivElement, {
        tooltip: DataPoint;
    }> | null;
    /** A custom renderer to draw overlay on top of the embedding view. */
    customOverlay?: CustomComponent<HTMLDivElement, {
        proxy: OverlayProxy;
    }> | null;
    /** A cache for intermediate results. */
    cache?: Cache_2 | null;
}

export declare interface EmbeddingViewTheme {
    /** The font family for texts. */
    fontFamily: string;
    /** Color for cluster labels. */
    clusterLabelColor: string;
    /** Color for cluster labels' outline. */
    clusterLabelOutlineColor: string;
    /** Opacity for cluster labels. */
    clusterLabelOpacity: number;
    /** Whether to show the status bar at the bottom. */
    statusBar: boolean;
    /** Color for status bar text. */
    statusBarTextColor: string;
    /** Color for status bar background. */
    statusBarBackgroundColor: string;
    /** Branding link. */
    brandingLink: {
        text: string;
        href: string;
    } | null;
}

export declare interface Label {
    /** X coordinate. */
    x: number;
    /** Y coordinate. */
    y: number;
    /** Label text, use "\n" for a new line. */
    text: string;
    /** Label level. The label will be shown around 2^level zoom factor. */
    level?: number | null;
    /** Placement priority. */
    priority?: number | null;
}

export declare function maxDensityModeCategories(): number;

export declare interface OverlayProxy {
    location: (x: number, y: number) => {
        x: number;
        y: number;
    };
    width: number;
    height: number;
}

/** A point with x and y coordinates. */
export declare interface Point {
    x: number;
    y: number;
}

/** A rectangle with min, max coordinate for each dimension.
 * It is required that xMin <= xMax and yMin <= yMax. */
export declare interface Rectangle {
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
}

declare type ThemeConfig = Partial<EmbeddingViewTheme> & {
    /** Overrides for light mode. */
    dark?: Partial<EmbeddingViewTheme>;
    /** Overrides for dark mode. */
    light?: Partial<EmbeddingViewTheme>;
};

/** A state describing the viewport's pan and zoom state.
 * The screen coordinate of a point is calculated as follows:
 * px = ((x - viewport.x) * viewport.scale + 1) / 2 * width
 * py = ((y - viewport.y) * viewport.scale + 1) / 2 * height
 */
export declare interface ViewportState {
    /** The x coordinate of the center of the viewport in data units. */
    x: number;
    /** The y coordinate of the center of the viewport in data units. */
    y: number;
    /** The scale of the viewport. This scales data units to [-1, 1]. */
    scale: number;
}

export { }
