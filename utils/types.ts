export type Image = {
  ImageUrl: string
  Description: string
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
}

export type EmissionPerYear = {
  Year: string
  CO2Equivalent: number
}

export type Emission = {
  EmissionPerYear: Array<EmissionPerYear>
  LargestEmissionSectors: Array<EmissionSector>
  EmissionLevelChangeAverage: number
  AverageEmissionChangeRank: number | null
}

export type Budget = {
  CO2Equivalent: number
  PercentageOfNationalBudget: number
  BudgetPerYear: Array<EmissionPerYear>
}

export type EmissionSector = {
  Name: string
  Year: string
  CO2Equivalent: number
  SubSectors: Array<EmissionSector>
}
