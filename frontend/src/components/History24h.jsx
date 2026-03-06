import React from "react";
import {
    LineChart,
    Line,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
// Added Gauge, Mountain, CloudRain to the import list below
import {
    Thermometer,
    Droplets,
    Wind,
    Gauge,
    Mountain,
    CloudRain,
} from "lucide-react";

const History24h = ({ dataHistory, isDark }) => {
    if (!dataHistory || dataHistory.length === 0) {
        return (
            <div className="flex justify-center items-center h-64 text-slate-500 font-medium">
                <span className="animate-pulse">
                    Loading 24h historical trends...
                </span>
            </div>
        );
    }

    const getAQIColor = (value) => {
        if (value <= 50) return "#00b050";
        if (value <= 100) return "#92d050";
        if (value <= 200) return "#ffff00";
        if (value <= 300) return "#ffc000";
        if (value <= 400) return "#ff0000";
        return "#c00000";
    };

    const MetricCard = ({ title, unit, icon: Icon, dataKey, color, isAQI }) => {
        const aqiLineColor = isDark ? "#f8fafc" : "#0f172a";
        const axisColor = isDark ? "#94a3b8" : "#64748b";
        const gridColor = isDark ? "#475569" : "#cbd5e1";

        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[350px] w-full transition-colors duration-300">
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

                <div className="flex-grow w-full h-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dataHistory}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={gridColor}
                                opacity={0.2}
                                vertical={false}
                            />
                            <XAxis
                                dataKey="timestamp"
                                stroke={axisColor}
                                fontSize={11}
                                tickMargin={12}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                domain={["auto", "auto"]}
                                stroke={axisColor}
                                fontSize={11}
                                width={50}
                                tickFormatter={(tick) => `${tick}${unit}`}
                            />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey={dataKey}
                                stroke={isAQI ? aqiLineColor : color}
                                strokeWidth={2}
                                dot={(props) => {
                                    const { cx, cy, payload } = props;
                                    const dotColor = isAQI
                                        ? getAQIColor(payload[dataKey])
                                        : "#fff";
                                    return (
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={3}
                                            fill={dotColor}
                                            stroke={isDark ? "#fff" : "#000"}
                                            strokeWidth={1}
                                        />
                                    );
                                }}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 md:p-6 w-full max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">
                24-Hour Analytics Summary
            </h1>
            <div className="grid grid-cols-1 gap-8">
                <MetricCard
                    title="Temperature Trend"
                    unit="°C"
                    icon={Thermometer}
                    dataKey="temp"
                    color="#f97316"
                />
                <MetricCard
                    title="Humidity Trend"
                    unit="%"
                    icon={Droplets}
                    dataKey="humidity"
                    color="#0ea5e9"
                />
                <MetricCard
                    title="Air Quality Index"
                    unit=" PPM"
                    icon={Wind}
                    dataKey="airQuality"
                    color="#ffffff"
                    isAQI={true}
                />
                {/* Add these to the grid inside History24h return */}
                <MetricCard
                    title="Pressure Trend"
                    unit=" hPa"
                    icon={Gauge}
                    dataKey="pressure"
                    color="#8b5cf6"
                />
                <MetricCard
                    title="Altitude Stability"
                    unit=" m"
                    icon={Mountain}
                    dataKey="altitude"
                    color="#ec4899"
                />
                <MetricCard
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
