export interface PopulationData {
    startPeriod: string;
    totalPopulation: number;
}

export interface BudgetData {
    startPeriod: string;
    totalBudget: number;
}

export default interface QuickMunicipalityData {
    population: PopulationData[];
    budget: BudgetData[];
}