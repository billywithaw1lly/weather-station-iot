import React, { useRef, useEffect, useState } from "react";
import {
    LineChart,
    Line,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    Label,
} from "recharts";
import {
    Thermometer,
    Droplets,
    Wind,
    Gauge,
    Mountain,
    CloudRain,
    ArrowUp,
    ArrowDown,
    Hash,
} from "lucide-react";

const History24h = ({ dataHistory, isDark, activeStation }) => {
    if (!dataHistory || dataHistory.length === 0) {
        return (
            <div className="flex justify-center items-center h-64 text-slate-500 font-medium">
                <span className="animate-pulse">
                    Loading 24h historical trends...
                </span>
            </div>
        );
    }

    const getTimeRange = () => {
        if (!dataHistory || dataHistory.length < 2)
            return { start: "--:--", end: "--:--", span: "0h 0m" };

        const start = dataHistory[0].timestamp;
        const end = dataHistory[dataHistory.length - 1].timestamp;

        const [h1, m1] = start.split(":").map(Number);
        const [h2, m2] = end.split(":").map(Number);

        let diff = h2 * 60 + m2 - (h1 * 60 + m1);
        if (diff < 0) diff += 1440;

        const hours = Math.floor(diff / 60);
        const mins = diff % 60;

        return { start, end, span: `${hours}h ${mins}m` };
    };

    const timeInfo = getTimeRange();

    const getAQIColor = (value) => {
        if (value <= 50) return "#00b050";
        if (value <= 100) return "#92d050";
        if (value <= 200) return "#ffff00";
        if (value <= 300) return "#ffc000";
        if (value <= 400) return "#ff0000";
        return "#c00000";
    };

    const calculateStats = (key) => {
        const values = dataHistory
            .map((item) => item[key])
            .filter((v) => typeof v === "number");
        if (values.length === 0) return { max: "--", min: "--", avg: "--" };
        const max = Math.max(...values);
        const min = Math.min(...values);
        const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(
            1,
        );
        return { max, min, avg };
    };

    const CustomTooltip = ({ active, payload, label, unit }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md bg-opacity-90">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Time: {label}
                    </p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-white text-lg font-black">
                            {payload[0].value}
                        </span>
                        <span className="text-slate-400 text-xs font-bold">
                            {unit}
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

    const MetricCard = ({
        title,
        unit,
        icon: Icon,
        dataKey,
        color,
        isAQI,
        activeStation,
    }) => {
        const aqiLineColor = isDark ? "#f8fafc" : "#0f172a";
        const axisColor = isDark ? "#94a3b8" : "#64748b";
        const gridColor = isDark ? "#475569" : "#cbd5e1";
        const stats = calculateStats(dataKey);

        // FIX: Re-added the scrollRef here so the drag handlers can use it
        const scrollRef = useRef(null);

        // NEW: State for Drag-to-Scroll functionality
        const [isDragging, setIsDragging] = useState(false);
        const [startX, setStartX] = useState(0);
        const [scrollLeftPos, setScrollLeftPos] = useState(0);

        // DRAG LOGIC HANDLERS
        const handleMouseDown = (e) => {
            setIsDragging(true);
            if (scrollRef.current) {
                setStartX(e.pageX - scrollRef.current.offsetLeft);
                setScrollLeftPos(scrollRef.current.scrollLeft);
            }
        };

        const handleMouseLeave = () => {
            setIsDragging(false);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        const handleMouseMove = (e) => {
            if (!isDragging || !scrollRef.current) return;
            e.preventDefault(); // Prevents text selection while dragging
            const x = e.pageX - scrollRef.current.offsetLeft;
            const walk = (x - startX) * 1.5; // Scroll speed multiplier
            scrollRef.current.scrollLeft = scrollLeftPos - walk;
        };

        const standardDot = {
            r: isDark ? 3 : 4,
            fill: isDark ? "#0f172a" : "#ffffff",
            stroke: color,
            strokeWidth: 2,
        };

        const aqiDot = (props) => {
            const { cx, cy, payload } = props;
            const dotColor = getAQIColor(payload[dataKey]);
            return (
                <circle
                    cx={cx}
                    cy={cy}
                    r={isDark ? 3 : 5}
                    fill={dotColor}
                    stroke={isDark ? dotColor : "#000000"}
                    strokeWidth={1.5}
                />
            );
        };

        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[520px] w-full transition-colors duration-300">
                {/* CSS Block to completely kill the scrollbar across all browsers */}
                <style>{`
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>

                <div className="flex items-center gap-3 mb-6">
                    <div
                        className="p-2 rounded-lg bg-opacity-10"
                        style={{
                            backgroundColor:
                                isAQI && !isDark ? "#0f172a20" : `${color}20`,
                            color: isAQI && !isDark ? "#0f172a" : color,
                        }}
                    >
                        <Icon size={24} />
                    </div>
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                        {title}
                    </h3>
                </div>

                {/* FIX: Added ref={scrollRef} here so the div is connected to the logic */}
                <div
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className={`flex-grow w-full overflow-x-auto overflow-y-hidden no-scrollbar mb-4 touch-pan-x select-none ${
                        isDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                    // Disable smooth scrolling ONLY while dragging so it doesn't stutter
                    style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
                >
                    <div style={{ width: "2000px", height: "100%" }}>
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                            className="pointer-events-none"
                        >
                            <LineChart
                                data={dataHistory}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 40,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={gridColor}
                                    opacity={0.1}
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="timestamp"
                                    stroke={axisColor}
                                    fontSize={10}
                                    tickMargin={35}
                                    angle={-90}
                                    textAnchor="end"
                                    interval={0}
                                />
                                <YAxis
                                    domain={["auto", "auto"]}
                                    stroke={axisColor}
                                    fontSize={10}
                                    width={40}
                                    tickFormatter={(tick) => `${tick}${unit}`}
                                />

                                <Tooltip
                                    content={<CustomTooltip unit={unit} />}
                                    cursor={{
                                        stroke: axisColor,
                                        strokeWidth: 1,
                                        strokeDasharray: "4 4",
                                    }}
                                />

                                <ReferenceLine
                                    y={stats.max}
                                    stroke="#10b981"
                                    strokeDasharray="4 4"
                                    strokeOpacity={0.4}
                                >
                                    <Label
                                        value="MAX"
                                        position="insideTopLeft"
                                        fill="#10b981"
                                        fontSize={8}
                                        opacity={0.6}
                                    />
                                </ReferenceLine>
                                <ReferenceLine
                                    y={stats.avg}
                                    stroke="#0ea5e9"
                                    strokeDasharray="4 4"
                                    strokeOpacity={0.4}
                                >
                                    <Label
                                        value="AVG"
                                        position="insideTopRight"
                                        fill="#0ea5e9"
                                        fontSize={8}
                                        opacity={0.6}
                                    />
                                </ReferenceLine>
                                <ReferenceLine
                                    y={stats.min}
                                    stroke="#f97316"
                                    strokeDasharray="4 4"
                                    strokeOpacity={0.4}
                                >
                                    <Label
                                        value="MIN"
                                        position="insideBottomLeft"
                                        fill="#f97316"
                                        fontSize={8}
                                        opacity={0.6}
                                    />
                                </ReferenceLine>

                                <Line
                                    type="monotone"
                                    dataKey={dataKey}
                                    stroke={isAQI ? aqiLineColor : color}
                                    strokeWidth={2.5}
                                    dot={isAQI ? aqiDot : standardDot}
                                    activeDot={{
                                        r: 6,
                                        fill: color,
                                        stroke: isDark ? "#0f172a" : "#ffffff",
                                        strokeWidth: 2,
                                    }}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col items-center">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 opacity-80 uppercase tracking-wider">
                            <ArrowUp size={12} /> Max
                        </span>
                        <span className="text-sm font-bold dark:text-slate-200">
                            {stats.max}
                            {unit}
                        </span>
                    </div>
                    <div className="flex flex-col items-center border-x border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 opacity-80 uppercase tracking-wider">
                            <ArrowDown size={12} /> Min
                        </span>
                        <span className="text-sm font-bold dark:text-slate-200">
                            {stats.min}
                            {unit}
                        </span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-sky-500 opacity-80 uppercase tracking-wider">
                            <Hash size={12} /> Avg
                        </span>
                        <span className="text-sm font-bold dark:text-slate-200">
                            {stats.avg}
                            {unit}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 md:p-6 w-full max-w-7xl mx-auto">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black dark:text-white tracking-tight leading-none mb-2">
                        24-Hour Summary
                    </h1>
                    <p className="text-slate-500 font-medium">
                        24h statistics for station {activeStation}
                    </p>
                </div>

                <div className="flex items-center gap-6 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Session Start
                        </span>
                        <span className="text-sm font-black dark:text-white">
                            {timeInfo.start}
                        </span>
                    </div>
                    <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Session End
                        </span>
                        <span className="text-sm font-black dark:text-white">
                            {timeInfo.end}
                        </span>
                    </div>
                    <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">
                            Total Span
                        </span>
                        <span className="text-sm font-black dark:text-white">
                            {timeInfo.span}
                        </span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8">
                <MetricCard
                    activeStation={activeStation}
                    title="Temperature Trend"
                    unit="°C"
                    icon={Thermometer}
                    dataKey="temp"
                    color="#f97316"
                />
                <MetricCard
                    activeStation={activeStation}
                    title="Humidity Trend"
                    unit="%"
                    icon={Droplets}
                    dataKey="humidity"
                    color="#0ea5e9"
                />
                <MetricCard
                    activeStation={activeStation}
                    title="Pressure Trend"
                    unit=" hPa"
                    icon={Gauge}
                    dataKey="pressure"
                    color="#8b5cf6"
                />
                <MetricCard
                    activeStation={activeStation}
                    title="Altitude Stability"
                    unit=" m"
                    icon={Mountain}
                    dataKey="altitude"
                    color="#ec4899"
                />
                <MetricCard
                    activeStation={activeStation}
                    title="Air Quality Index"
                    unit=" PPM"
                    icon={Wind}
                    dataKey="airQuality"
                    color="#ffffff"
                    isAQI={true}
                />
                <MetricCard
                    activeStation={activeStation}
                    title="Rainfall Levels"
                    unit=""
                    icon={CloudRain}
                    dataKey="rain"
                    color="#64748b"
                />
            </div>
        </div>
    );
};

export default History24h;
