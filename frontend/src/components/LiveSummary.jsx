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
import { Thermometer, Droplets, Wind } from "lucide-react";

// 1. Add isDark to props
const LiveSummary = ({ dataHistory, isDark }) => {
    if (!dataHistory || dataHistory.length === 0) {
        return (
            <div className="flex justify-center items-center h-64 text-slate-500 font-medium">
                <span className="animate-pulse">
                    Awaiting telemetry data...
                </span>
            </div>
        );
    }

    const getAQIColor = (value) => {
        if (value <= 50) return "#00b050"; // Good (Green)
        if (value <= 100) return "#92d050"; // Satisfactory (Light Green)
        if (value <= 200) return "#ffff00"; // Moderate (Yellow)
        if (value <= 300) return "#ffc000"; // Poor (Orange)
        if (value <= 400) return "#ff0000"; // Very Poor (Red)
        return "#c00000"; // Severe (Maroon)
    };

    const currentData = dataHistory[dataHistory.length - 1];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
                    <p className="text-slate-400 text-xs mb-1 font-medium">{`Time: ${label || "Recent"}`}</p>
                    <p className="text-white font-bold text-lg">
                        {`${payload[0].value} `}
                        <span className="text-sm text-slate-300 font-normal">
                            {payload[0].name === "airQuality" ? "PPM" : ""}
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const MetricCard = ({
        title,
        value,
        unit,
        icon: Icon,
        dataKey,
        color,
        isAQI,
    }) => {
        // 2. Logic for dynamic colors based on isDark prop
        const aqiLineColor = isDark ? "#f8fafc" : "#0f172a"; // White in dark, Black in light
        const axisColor = isDark ? "#94a3b8" : "#64748b";
        const gridColor = isDark ? "#475569" : "#cbd5e1";

        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[400px] w-full transition-colors duration-300">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="p-2 rounded-lg bg-opacity-10"
                            style={{
                                backgroundColor:
                                    isAQI && !isDark
                                        ? "#0f172a20"
                                        : `${color}20`,
                                color: isAQI && !isDark ? "#0f172a" : color,
                            }}
                        >
                            <Icon size={24} />
                        </div>
                        <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                            {title}
                        </h3>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                            {value !== undefined ? value : "--"}
                        </span>
                        <span className="text-slate-500 ml-1 font-medium">
                            {unit}
                        </span>
                    </div>
                </div>

                <div className="flex-grow w-full h-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={dataHistory}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 10,
                                bottom: 20,
                            }}
                        >
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
                                minTickGap={30}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                domain={["auto", "auto"]}
                                stroke={axisColor}
                                fontSize={11}
                                width={50}
                                tickMargin={8}
                                tickFormatter={(tick) => `${tick}${unit}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey={dataKey}
                                // 3. Apply the dynamic line color
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
                                            r={3.5}
                                            fill={dotColor}
                                            // 4. Dot border flips to contrast the line
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
        <div className="p-4 md:p-6 w-full flex justify-center">
            <div className="grid grid-cols-1 gap-6 w-full max-w-7xl">
                <MetricCard
                    title="Temperature"
                    value={currentData.temp}
                    unit="°C"
                    icon={Thermometer}
                    dataKey="temp"
                    color="#f97316"
                />
                <MetricCard
                    title="Humidity"
                    value={currentData.humidity}
                    unit="%"
                    icon={Droplets}
                    dataKey="humidity"
                    color="#0ea5e9"
                />
                <MetricCard
                    title="Air Quality"
                    value={currentData.airQuality}
                    unit=" PPM"
                    icon={Wind}
                    dataKey="airQuality"
                    color="#ffffff"
                    isAQI={true}
                />
            </div>
        </div>
    );
};

export default LiveSummary;
