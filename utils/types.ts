import { datasetDescriptions } from './datasetDescriptions'

export type Image = {
  ImageUrl: string
  Description: string
}

export type EmissionPerYear = {
  Year: number
  CO2Equivalent: number
}

export type EmissionSector = {
  Name: string
 // Year: string
 // CO2Equivalent: number
 // SubSectors: Array<EmissionSector>
  EmissionsPerYear: Array<EmissionPerYear>
}

export type Emission = {
  EmissionPerYear: Array<EmissionPerYear>
  //LargestEmissionSectors: Array<EmissionSector>
  SectorEmissionsPerYear: Array<EmissionSector>
  //LargestEmissionSectors2: Array<EmissionSector>
  EmissionLevelChangeAverage: number
  AverageEmissionChangeRank: number | null
}

export type Budget = {
  CO2Equivalent: number
  PercentageOfNationalBudget: number
  BudgetPerYear: Array<EmissionPerYear>
}

export type Trend = {
  TrendPerYear: Array<EmissionPerYear>
  FutureCO2Emission: number
}

export type ClimatePlan = {
  Link: string
  YearAdapted: string
  Comment: string
}

export type Municipality = {
  County: string
  Name: string
  CoatOfArmsImage: Image | null
  Population: number | null
  Image: Image | null
  Budget: Budget
  HistoricalEmission: Emission
  PoliticalRule: Array<string> | null
  EmissionTrend: Trend
  EmissionChangePercent: number
  HitNetZero: number | string
  BudgetRunsOut: string
  ElectricCars: number
  ElectricCarChangePercent: number,
  ElectricCarChangeYearly: Array<number>,
  ClimatePlan: ClimatePlan,
  BicycleMetrePerCapita: number,
  TotalConsumptionEmission: number,
}

export type SelectedData = keyof typeof datasetDescriptions

export type DatasetType = 'Percent' | 'Link' | 'Number'

export type DatasetDescription = {
  title: string
  heading: string
  body: string | JSX.Element
  source: React.ReactNode
  boundaries: number[] | string[]
  labels: string[]
  labelRotateUp: boolean[]
  columnHeader: string
  tooltip: string
  dataType: DatasetType
  sortAscending?: boolean
}

export type DatasetDescriptions = {
  [key: string]: DatasetDescription
}

export type RankedData = {
  [key: string]: {
    name: string;
    dataPoint: number | string;
    rank?: number | undefined;
}[]

}
