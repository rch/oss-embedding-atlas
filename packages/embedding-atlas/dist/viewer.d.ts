import { Coordinator } from '@uwdata/mosaic-core';
import { JSONSchema7 } from 'json-schema';
import { Readable } from 'svelte/store';

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
    selection?: Record<string, Selection_2>;
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

declare type CustomComponentClass<N, P> = new (node: N, props: P) => {
    update?: (props: P) => void;
    destroy?: () => void;
};

/** Data value (a value in the data domain, which can be mapped to the visual domain through a scale) */
declare type DataValue = string | number | [number, number];

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

declare interface EmbeddingViewConfig {
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

declare interface Label {
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

declare interface PredicatesSpec {
    type: "predicates";
    title?: string;
    items?: {
        name: string;
        predicate: string;
    }[];
}

export declare function registerRenderer(options: {
    name: string;
    label?: string;
    description?: string;
    renderer: RendererComponent;
    options?: RendererOptionsComponent;
}): void;

/** Component for a custom value renderer */
declare type RendererComponent = CustomComponentClass<HTMLElement, RendererProps>;

/** Component for a custom value renderer's options config panel */
declare type RendererOptionsComponent = CustomComponentClass<HTMLElement, RendererOptionsProps>;

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
declare interface Selection_2 {
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
