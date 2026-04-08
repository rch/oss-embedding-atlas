import { Coordinator } from '@uwdata/mosaic-core';
import { JSONSchema7 } from 'json-schema';
import { Readable } from 'svelte/store';
import { Selection as Selection_2 } from '@uwdata/mosaic-core';

declare type AggregateFn = "count" | "distinct" | "min" | "max" | "mean" | "average" | "median" | "stdev" | "stdevp" | "variance" | "variancep" | "sum" | "product" | "quantile" | "ecdf-value" | "ecdf-rank";

/** Mark attribute */
declare type Attribute = "x" | "y" | "x1" | "x2" | "y1" | "y2" | "color" | "size" | "group";

declare interface Axis {
    /** Axis title */
    title?: string;
    /** Values for ticks, grid lines, and labels */
    values?: any[];
    /** Desired number of ticks. Default 5. */
    desiredTickCount?: number;
    /** Extend scale to ticks. Default true. */
    extendScaleToTicks?: boolean;
    /** Padding to label */
    labelPadding?: number;
    /** Label font family */
    labelFontFamily?: string;
    /** Label font size */
    labelFontSize?: number;
    /** Label max width */
    labelMaxWidth?: number;
}

export declare type BuiltinChartSpec = ChartSpec | ContentViewerSpec | CountPlotSpec | EmbeddingSpec | InstancesSpec | MarkdownSpec | PredicatesSpec;

declare interface Cache_2 {
    /** Gets an object from the cache with the given key. Returns `null` if the entry is not found. */
    get(key: string): Promise<any | null>;
    /** Sets an object to the cache with the given key */
    set(key: string, value: any): Promise<void>;
}
export { Cache_2 as Cache }

declare interface Cache_2_2 {
    get: (key: string) => Promise<any | null>;
    set: (key: string, value: any) => Promise<void>;
}

/** Encoding channel */
declare type Channel = "x" | "y" | "color" | "size";

/** Chart specification */
declare interface ChartSpec {
    /** The title of the chart */
    title?: string;
    /** Size configuration */
    plotSize?: {
        /** Width of the plot area */
        width?: number;
        /** Height of the plot area */
        height?: number;
        /** Aspect ratio of the plot area */
        aspectRatio?: number;
    };
    /** Layers */
    layers?: Layer[];
    /** Scale configurations */
    scale?: Partial<Record<Channel, Scale>>;
    /** Axis configurations */
    axis?: Partial<Record<"x" | "y", Axis>>;
    /** Selections */
    selection?: Record<string, Selection_2_2>;
    /** Widgets */
    widgets?: Widget[];
}

declare interface ChartTheme {
    scheme: "light" | "dark";
    /** Default interpolate for continuous color scales */
    interpolate: string | string[] | ((v: number) => string);
    /** Category color scheme */
    categoryColors: string[] | ((count: number) => string[]);
    /** Ordinal color scheme */
    ordinalColors: string[] | ((count: number) => string[]);
    /** Color for the '(other)' category */
    otherColor: string;
    /** Color for the '(null)' category */
    nullColor: string;
    /** Mark color */
    markColor: string;
    markColorFade: string;
    markColorGray: string;
    markColorGrayFade: string;
    ruleColor: string;
    /** Embedding view point / contour color when there is no color encoding */
    embeddingColor: string;
    /** Grid color */
    gridColor: string;
    /** Label color */
    labelColor: string;
    labelFontFamily: string;
    labelFontSize: number;
    labelMaxWidth: number;
    /** Border of the brush selection */
    brushBorder: string;
    /** Back border of the brush selection */
    brushBorderBack: string;
    /** Fill color of the brush selection */
    brushFill: string;
}

declare type ChartThemeConfig = Partial<ChartTheme> & {
    light?: Partial<ChartTheme>;
    dark?: Partial<ChartTheme>;
};

/** A resulting cluster from the find clusters function */
export declare interface Cluster {
    /** Cluster identifier */
    identifier: number;
    /** The total density */
    sumDensity: number;
    /** The mean x location (weighted by density) */
    meanX: number;
    /** The mean y location (weighted by density) */
    meanY: number;
    /** The maximum density */
    maxDensity: number;
    /** The location with the maximum density */
    maxDensityLocation: [number, number];
    /** The number of pixels in the cluster */
    pixelCount: number;
    /** The cluster's boundary represented as a list of polygons */
    boundary?: [number, number][][];
    /** The cluster's boundary approximated with a list of rectangles, each rectangle is given as an array `[x1, y1, x2, y2]` */
    boundaryRectApproximation?: [number, number, number, number][];
}

/** A type describing how to display a column in the table, tooltip, and search results */
declare interface ColumnStyle {
    /**
     * The renderer name. Builtin options:
     * - "markdown": Render the value as Markdown
     * - "liquid-template": Render the value with a Liquid template (rendered with liquidjs). Options: template (string): the template, default to "{{ value }}".
     * - "image": Render an image. Options: size (number): the max width/height of the image.
     * - "url": Render the value as a link
     * - "json": Render the value as a JSON string
     * - "messages": Render chat messages (OpenAI format)
     */
    renderer?: string;
    /** Options passed to the renderer class as props */
    options?: Record<string, any>;
    /** Display style in the tooltip */
    display?: "full" | "badge" | "hidden";
}

declare interface ContentViewerSpec {
    type: "content-viewer";
    title?: string;
    field: string;
}

declare interface CountPlotSpec {
    type: "count-plot";
    title?: string;
    data: {
        /** The data field */
        field: SQLField;
        /** Indicate if the field contains list[str] data, default false */
        isList?: boolean;
    };
    /** The max number of categories to show, default 10 */
    limit?: number;
    /** Labeling method, '%': percentage, '#': count, '#/#': selected count over total count */
    labels?: "%" | "#" | "#/#";
    /** Order the categories by total count, selected count, alphabetical, or custom order, default 'total-descending' */
    order?: "total-descending" | "total-ascending" | "selected-descending" | "selected-ascending" | "alphabetical" | string[];
}

export declare function createKNN(count: number, inputDim: number, data: Float32Array, options?: KNNOptions): Promise<KNN>;

/**
 * Initialize a UMAP instance.
 * @param count the number of data points
 * @param inputDim the input dimension
 * @param outputDim the output dimension
 * @param data the data array. Must be a Float32Array with count * inputDim elements.
 * @param options options
 */
export declare function createUMAP(
count: number,
inputDim: number,
outputDim: number,
data: Float32Array,
options?: UMAPOptions,
): Promise<UMAP>;

export declare type CustomComponent<N, P> = {
    class: CustomComponentClass<N, P & any>;
    props?: Record<string, any>;
} | CustomComponentClass<N, P>;

declare type CustomComponentClass<N, P> = new (node: N, props: P) => {
    update?: (props: P) => void;
    destroy?: () => void;
};

declare type CustomComponentClass_2<N, P> = new (node: N, props: P) => {
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

/** Data value (a value in the data domain, which can be mapped to the visual domain through a scale) */
declare type DataValue = string | number | [number, number];

export declare function defaultCategoryColors(count: number): string[];

/** Returns a list of default charts for a given data table. */
export declare function defaultCharts(options: {
    coordinator: Coordinator;
    table: string;
    id: string;
    projection?: {
        x: string;
        y: string;
        text?: string;
    };
    config?: DefaultChartsConfig;
}): Promise<BuiltinChartSpec[]>;

declare interface DefaultChartsConfig {
    /** If specified, only include the given columns */
    include?: string[];
    /** Columns to exclude, applicable if `include` is not specified */
    exclude?: string[];
    /** Override the chart spec for certain columns. If the override is set to `null` the column will be skipped */
    override?: Record<string, BuiltinChartSpec | null>;
    /** Set to false to disable the instances table, or an object to override spec properties */
    table?: boolean | Partial<InstancesSpec>;
    /** Set to false to disable the embedding view, or an object to override spec properties */
    embedding?: boolean | Partial<EmbeddingSpec>;
}

/** Mark dimension for width and height */
declare type Dimension = {
    gap: number;
    clampToRatio?: number;
} | {
    ratio: number;
} | number;

export declare class EmbeddingAtlas {
    private component;
    private container;
    private currentProps;
    constructor(target: HTMLElement, props: EmbeddingAtlasProps);
    update(props: Partial<EmbeddingAtlasProps>): void;
    destroy(): void;
}

export declare interface EmbeddingAtlasProps {
    /** The Mosaic coordinator. */
    coordinator: Coordinator;
    /** The data source. */
    data: {
        /** The name of the data table. */
        table: string;
        /** The column for unique row identifiers. */
        id: string;
        /** The X and Y columns for the embedding projection view. */
        projection?: {
            x: string;
            y: string;
        } | null;
        /** The column for pre-computed nearest neighbors.
         *  Each value in the column should be a dictionary with the format: `{ "ids": [id1, id2, ...], "distances": [distance1, distance2, ...] }`.
         *  `"ids"` should be an array of row ids (as given by the `idColumn`) of the neighbors, sorted by distance.
         *  `"distances"` should contain the corresponding distances to each neighbor.
         *  Note that if `searcher.nearestNeighbors` is specified, the UI will use the searcher instead.
         */
        neighbors?: string | null;
        /** The column for text. The text will be used as content for the tooltip and search features. */
        text?: string | null;
    };
    /** The color scheme. */
    colorScheme?: "light" | "dark" | null;
    /** The initial viewer state. */
    initialState?: EmbeddingAtlasState | null;
    /**
     * Configure the default charts.
     * By default, we show a distribution chart for each column based on the data type in addition to the embedding and table.
     * You may configure these charts with this option.
     */
    defaultChartsConfig?: DefaultChartsConfig | null;
    /** Configuration for the embedding view. See docs for the EmbeddingView. */
    embeddingViewConfig?: EmbeddingViewConfig | null;
    /** Labels for the embedding view. */
    embeddingViewLabels?: Label[] | null;
    /** Theme config for charts. */
    chartTheme?: ChartThemeConfig | null;
    /** Custom CSS stylesheet to apply at the root of the component. */
    stylesheet?: string | null;
    /** An object that provides search functionalities, including full text search, vector search, and nearest neighbor queries.
     *  If not specified (undefined), a default full-text search with the text column will be used.
     *  If set to null, search will be disabled. */
    searcher?: Searcher | null;
    /** A callback to export the currently selected points. */
    onExportSelection?: ((predicate: string | null, format: "json" | "jsonl" | "csv" | "parquet") => Promise<void>) | null;
    /** A callback to download the application as archive. */
    onExportApplication?: (() => Promise<void>) | null;
    /** A callback when the state of the viewer changes. You may serialize the state to JSON and load it back. */
    onStateChange?: ((state: EmbeddingAtlasState) => void) | null;
    /** Model context API where the component will register its tools to. */
    modelContext?: ModelContextAPI | null;
    /** A cache to speed up initialization of the viewer. */
    cache?: Cache_2 | null;
}

export declare interface EmbeddingAtlasState {
    /** The version of Embedding Atlas that created this state. If omitted, assume the current version. */
    version?: string;
    /** UNIX timestamp when this was created. */
    timestamp?: number;
    /** The list of charts. */
    charts?: Record<string, any>;
    /** The state of all charts, stored as a map of id to chart state. */
    chartStates?: Record<string, any>;
    /** The current layout */
    layout?: string;
    /** The state of all layouts. */
    layoutStates?: Record<string, any>;
    /** Column display and rendering styles. */
    columnStyles?: Record<string, ColumnStyle>;
    /** The selection predicate (SQL expression).
     *  This property is derived from chart states, changing this directly has no effect. */
    predicate?: string | null;
}

declare interface EmbeddingSpec {
    type: "embedding";
    title?: string;
    data: {
        x: string;
        y: string;
        text?: string | null;
        category?: string | null;
    };
    mode?: "points" | "density";
    minimumDensity?: number;
    pointSize?: number;
    /** Maximum number of points to render (for downsampling). Default: 4000000. Set to null to disable. */
    downsampleMaxPoints?: number | null;
    config?: EmbeddingViewConfig;
}

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
    cache?: Cache_2_2 | null;
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
    cache?: Cache_2_2 | null;
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

/** Encoding */
declare type Encoding = {
    /** The data field to encode */
    field: SQLField;
    bin?: {
        /** Desired bin count */
        desiredCount?: number;
    };
} | {
    /** Aggregate type */
    aggregate: AggregateFn | {
        sql: string;
    };
    /** The data field for the aggregate */
    field?: SQLField;
    /** For "quantile" aggregate, the quantile value (0-1) */
    quantile?: number;
    /** Normalize the value by x or y */
    normalize?: "x" | "y";
} | {
    /** The data value to encode */
    value: DataValue;
};

/**
 * Find clusters from a density map
 * @param density_map the density map, a `Float32Array` with `width * height` elements
 * @param width the width of the density map
 * @param height the height of the density map
 * @param options algorithm options
 * @returns
 */
export declare function findClusters(
densityMap: Float32Array,
width: number,
height: number,
options?: Partial<FindClustersOptions>,
): Promise<Cluster[]>;

/** Options of the find clusters function */
export declare interface FindClustersOptions {
    /** The threshold for unioning two clusters */
    unionThreshold: number;
}

declare interface InstancesSpec {
    type: "instances";
    title?: string;
    /**
     * Columns to show in the instance view.
     * If specified, the table and card views will be limited to the given columns, and custom card template will only receive the given columns as data.
     * If not specified, include all columns from the dataset (or query result is `query` is specified).
     */
    columns?: string[];
    /** Sort order. If not specified, use original data order. */
    sort?: SortOrder;
    /** View mode, defaults to "table" */
    viewMode?: "table" | "cards";
    /** Optional custom SQL query to filter or transform the data */
    query?: string;
    /** Number of items per page, defaults to 100 */
    pageSize?: number;
    /** Default height in pixels, defaults to 500. This value is used when the view's height is flexible. */
    defaultHeight?: number;
    /** Column styles specific to this instance view. These will override global column styles. */
    columnStyles?: Record<string, ColumnStyle>;
    /**
     * Liquid template for the cards (rendered with liquidjs).
     * Use a Liquid template instead of column styles for custom cards.
     * If not specified, use the tooltip view as card.
     */
    cardTemplate?: string;
}

/** Interpolate method for line or area */
declare type Interpolate = "linear" | "cardinal" | "catmull-rom" | "natural" | "monotone" | "basis" | "step" | "step-before" | "step-after";

export declare interface KNN {
    queryByIndex(index: number, k: number): KNNQueryResult;
    queryByVector(data: Float32Array, k: number): KNNQueryResult;
    destroy(): void;
}

/** KNN options */
export declare interface KNNOptions {
    /** The distance metric */
    metric?: "euclidean" | "cosine";

    /** The nearest neighbor method. By default we use HNSW with its default parameters. */
    method?: "hnsw" | "nndescent" | "vptree";
}

export declare interface KNNQueryResult {
    indices: Int32Array;
    distances: Float32Array;
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

declare interface Layer {
    /** Data source, default to the main data table */
    from?: SQLTable;
    /** Filter the data. Use $filter to refer to the shared filter (a cross-filter) */
    filter?: "$filter";
    /** Mark type */
    mark: MarkType;
    /** Mark style */
    style?: MarkStyle;
    /**
     * z-index indicating the layer order. Default value is 0.
     * If the value is negative, the mark will be drawn below grid lines.
     */
    zIndex?: number;
    /** Orientation of bar marks */
    orientation?: "vertical" | "horizontal";
    /** Interpolate method for line and area marks */
    interpolate?: Interpolate;
    /** Width of bar / rect marks */
    width?: Dimension;
    /** Height of bar / rect marks */
    height?: Dimension;
    /** Size (area) of point marks, default 100. */
    size?: number;
    /** Encoding */
    encoding?: Partial<Record<Attribute, Encoding>>;
}

declare interface MarkdownSpec {
    type: "markdown";
    title?: string;
    content: string;
}

/** Mark style */
declare interface MarkStyle {
    /** Fill color. If `null`, disable fill. Default is based on mark type. */
    fillColor?: string | null;
    /** Fill opacity */
    fillOpacity?: number;
    /** Stroke color. If `null`, disable stroke. Default is based on mark type. */
    strokeColor?: string | null;
    /** Stroke width */
    strokeWidth?: number;
    /** Stroke opacity */
    strokeOpacity?: number;
    /** Stroke cap */
    strokeCap?: "butt" | "round" | "square";
    /** Stroke join */
    strokeJoin?: "round" | "miter" | "bevel";
    /** Paint order, default is `fill stroke`, fill first, then stroke. */
    paintOrder?: "fill stroke" | "stroke fill";
    /** Opacity */
    opacity?: number;
}

/** Mark type */
declare type MarkType = "bar" | "rect" | "line" | "area" | "point" | "rule";

export declare function maxDensityModeCategories(): number;

declare interface MCPContext {
    tools?: MCPTool[];
}

/** Tool definition interface */
declare interface MCPTool {
    /** Unique name for the tool */
    name: string;
    /** The title of the tool */
    title?: string;
    /** Natural language description of what the tool does */
    description: string;
    /** JSON Schema defining the input parameters */
    inputSchema: JSONSchema7;
    /** JSON Schema defining the output parameters */
    outputSchema?: JSONSchema7;
    /** Function that implements the tool and returns a result */
    execute: (input: any, agent: unknown) => Promise<ToolResponse>;
}

/** A type that mirrors the current design in the upcoming navigator.modelContext API */
declare interface ModelContextAPI {
    provideContext(context: MCPContext): void;
    readonly connectionStatus?: Readable<"connecting" | "connected" | "closed" | "error">;
}

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

declare interface PredicatesSpec {
    type: "predicates";
    title?: string;
    items?: {
        name: string;
        predicate: string;
    }[];
}

/** A rectangle with min, max coordinate for each dimension.
 * It is required that xMin <= xMax and yMin <= yMax. */
export declare interface Rectangle {
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
}

export declare function registerRenderer(options: {
    name: string;
    label?: string;
    description?: string;
    renderer: RendererComponent;
    options?: RendererOptionsComponent;
}): void;

/** Component for a custom value renderer */
declare type RendererComponent = CustomComponentClass_2<HTMLElement, RendererProps>;

/** Component for a custom value renderer's options config panel */
declare type RendererOptionsComponent = CustomComponentClass_2<HTMLElement, RendererOptionsProps>;

declare interface RendererOptionsProps {
    options?: Record<string, any>;
    onChange?: (value?: Record<string, any>) => void;
}

declare interface RendererProps {
    value: any;
    options?: Record<string, any>;
}

/** Scale */
declare interface Scale {
    /** Scale type for quantitative scales */
    type?: ScaleType;
    /** Scale domain */
    domain?: DataValue[];
    /** Special values. All represented as strings. */
    specialValues?: string[];
    /** symlog constant. */
    constant?: number;
    /**
     * Scale range. Currently do not apply for x and y scales.
     * For size scales, this should be [min, max] size.
     * For nominal color scales, this should be a list of colors.
     * For quantitative color scales, this should be a predefined interpolate scheme, or a list of colors to interpolate.
     */
    range?: (string | number)[] | string;
}

/** Scale type */
declare type ScaleType = "linear" | "log" | "symlog" | "band";

export declare interface Searcher {
    /** Perform a full text search with the given query */
    fullTextSearch?(query: string, options?: {
        limit?: number;
        predicate?: string | null;
        onStatus?: (status: string) => void;
    }): Promise<{
        id: any;
    }[]>;
    /** Perform a vector search with the given query */
    vectorSearch?(query: string, options?: {
        limit?: number;
        predicate?: string | null;
        onStatus?: (status: string) => void;
    }): Promise<{
        id: any;
        distance?: number;
    }[]>;
    /** Find nearest neighbors of the row of the given id */
    nearestNeighbors?(id: any, options?: {
        limit?: number;
        predicate?: string | null;
        onStatus?: (status: string) => void;
    }): Promise<{
        id: any;
        distance?: number;
    }[]>;
}

/** Chart selection */
declare interface Selection_2_2 {
    encoding: "x" | "y" | "xy";
}

declare type SortOrder = {
    column: string;
    direction: "ascending" | "descending";
}[];

/** Field from the data table, can be a column name or a SQL expression */
declare type SQLField = string | {
    sql: string;
};

/** Table name or SQL expression that produces a table */
declare type SQLTable = string | {
    sql: string;
};

declare type ThemeConfig = Partial<EmbeddingViewTheme> & {
    /** Overrides for light mode. */
    dark?: Partial<EmbeddingViewTheme>;
    /** Overrides for dark mode. */
    light?: Partial<EmbeddingViewTheme>;
};

/** Tool response format */
declare interface ToolResponse {
    content: Array<{
        type: "text" | "image" | "video";
        text?: string;
        url?: string;
        [key: string]: any;
    }>;
    isError?: boolean;
}

export declare interface UMAP {
    /** The current epoch number */
    get epoch(): number;

    /** The input dimension */
    get inputDim(): number;

    /** The output dimension */
    get outputDim(): number;

    /**
     * Get the current embedding.
     * The resulting Float32Array points to WASM internal memory.
     * If you need to use the data outside this library or after further
     * interaction with this library, make sure to create a copy
     * of the array, as the underlying memory may change.
     */
    get embedding(): Float32Array;

    /**
     * Run the UMAP algorithm until reaching `epochLimit` epochs,
     * or to completion if `epochLimit` is not specified.
     * @param epochLimit the epoch number to run to
     */
    run(epochLimit?: number): void;

    /** Destroy the instance and release resources */
    destroy(): void;
}

/** UMAP options */
export declare interface UMAPOptions {
    /** The input distance metric */
    metric?: "euclidean" | "cosine";

    /** The nearest neighbor method. By default we use HNSW with its default parameters. */
    knnMethod?: "hnsw" | "nndescent" | "vptree";

    /** The initialization method. By default we use spectral initialization. */
    initializeMethod?: "spectral" | "random" | "none";

    localConnectivity?: number;
    bandwidth?: number;
    mixRatio?: number;
    spread?: number;
    minDist?: number;
    a?: number;
    b?: number;
    repulsionStrength?: number;
    nEpochs?: number;
    learningRate?: number;
    negativeSampleRate?: number;
    nNeighbors?: number;
    /** The random seed. */
    seed?: number;
}

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

/** Widget for editing a chart */
declare type Widget = {
    type: "scale.type";
    channel: Channel;
} | {
    type: "encoding.normalize";
    layer: number | number[];
    attribute: Attribute;
    options: ("x" | "y")[];
};

export { }
