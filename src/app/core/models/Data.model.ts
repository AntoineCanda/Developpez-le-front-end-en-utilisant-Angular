
export interface ISeriesData {
    name: string; 
    value: number;
}

export interface ILineChartData {
    name: string;
    series: ISeriesData[];
}

export interface ICountryStatData {
    country: string;
    totalParticipation: number;
    totalAthlete: number;
    totalMedal: number;
}
