export interface PopulationData {
    startPeriod: string;
    totalPopulation: number;
}

export default interface QuickMunicipalityData {
    population: PopulationData[];
}