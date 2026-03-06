import React from "react";
import {
    Thermometer,
    Droplets,
    Wind,
    Gauge,
    Mountain,
    CloudRain,
    Activity,
    ArrowUp,
    ArrowDown,
    Hash,
} from "lucide-react";

const LiveSummary = ({ currentReading, activeStation, dataHistory }) => {
    if (!currentReading) {
        return (
            <div className="flex flex-col justify-center items-center h-96 text-slate-500 font-medium">
                <Activity className="animate-pulse mb-4" size={48} />
                <span>
                    Station {activeStation} is offline or initializing...
                </span>
            </div>
        );
    }

    const getStats = (key) => {
        if (!dataHistory || dataHistory.length === 0)
            return { max: "--", min: "--", avg: "--" };
        const values = dataHistory
            .map((item) => item[key])
            .filter((v) => v !== undefined);
        if (values.length === 0) return { max: "--", min: "--", avg: "--" };

        const max = Math.max(...values);
        const min = Math.min(...values);
        const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(
            1,
        );
        return { max, min, avg };
    };

    const LiveCard = ({
        title,
        value,
        unit,
        icon: Icon,
        color,
        subtext,
        dataKey,
    }) => {
        const stats = getStats(dataKey);

        return (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl transition-all flex flex-row h-[200px] gap-6">
                <div className="flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div
                            className="p-3 rounded-2xl bg-opacity-10"
                            style={{
                                backgroundColor: `${color}20`,
                                color: color,
                            }}
                        >
                            <Icon size={28} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {subtext}
                        </span>
                    </div>

                    <div className="flex-grow flex flex-col justify-center">
                        <h3 className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase mb-1">
                            {title}
                        </h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black tracking-tighter dark:text-white">
                                {value}
                            </span>
                            <span className="text-xl font-bold text-slate-400">
                                {unit}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="w-[80px] flex flex-col justify-between pt-1 border-l border-slate-100 dark:border-slate-800 pl-6 h-full">
                    <div className="flex flex-col items-center">
                        <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase">
                            <ArrowUp size={10} /> Max
                        </span>
                        <span className="text-xs font-semibold dark:text-slate-200">
                            {stats.max}
                            {unit}
                        </span>
                    </div>
                    <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />
                    <div className="flex flex-col items-center">
                        <span className="flex items-center gap-1 text-[9px] font-bold text-orange-500 uppercase">
                            <ArrowDown size={10} /> Min
                        </span>
                        <span className="text-xs font-semibold dark:text-slate-200">
                            {stats.min}
                            {unit}
                        </span>
                    </div>
                    <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />
                    <div className="flex flex-col items-center">
                        <span className="flex items-center gap-1 text-[9px] font-bold text-sky-500 uppercase">
                            <Hash size={10} /> Avg
                        </span>
                        <span className="text-xs font-semibold dark:text-slate-200">
                            {stats.avg}
                            {unit}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
            <header className="mb-12">
                <h1 className="text-4xl font-black dark:text-white tracking-tight">
                    SkyNet Live Summary
                </h1>
                <p className="text-slate-500 font-medium">
                    Instant telemetry for station {activeStation}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <LiveCard
                    title="Temperature"
                    value={currentReading.temp}
                    unit="°C"
                    icon={Thermometer}
                    color="#f97316"
                    subtext="Thermal"
                    dataKey="temp"
                />
                <LiveCard
                    title="Humidity"
                    value={currentReading.humidity}
                    unit="%"
                    icon={Droplets}
                    color="#0ea5e9"
                    subtext="Atmospheric"
                    dataKey="humidity"
                />
                <LiveCard
                    title="Pressure"
                    value={currentReading.pressure}
                    unit="hPa"
                    icon={Gauge}
                    color="#8b5cf6"
                    subtext="Barometric"
                    dataKey="pressure"
                />
                <LiveCard
                    title="Altitude"
                    value={currentReading.altitude}
                    unit="m"
                    icon={Mountain}
                    color="#ec4899"
                    subtext="Elevation"
                    dataKey="altitude"
                />
                <LiveCard
                    title="Air Quality"
                    value={currentReading.airQuality}
                    unit="PPM"
                    icon={Wind}
                    color="#10b981"
                    subtext="Environment"
                    dataKey="airQuality"
                />
                <LiveCard
                    title="Rain Level"
                    value={currentReading.rain}
                    unit="Raw"
                    icon={CloudRain}
                    color="#64748b"
                    subtext="Precipitation"
                    dataKey="rain"
                />
            </div>

            <footer className="mt-16 p-4 rounded-3xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-center">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Last Packet Received: {currentReading.timestamp}
                </p>
            </footer>
        </div>
    );
};

export default LiveSummary;
