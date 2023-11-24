# -*- coding: utf-8 -*-

import json
import numpy as np
import pandas as pd

from solutions.cars.car_data_calculations import car_calculations
from solutions.bicycles.bicycle_data_calculations import bicycle_calculations
from facts.plans.plans_data_prep import get_climate_plans
from facts.municipalities_counties import get_municipalities
from issues.emissions.emission_data_calculations import emission_calculations
from issues.consumption.consumption_data_calculations import get_consumption_emissions
from export_data import export_to_xlsx

# Notebook from ClimateView that our calculations are based on:
# https://colab.research.google.com/drive/1qqMbdBTu5ulAPUe-0CRBmFuh8aNOiHEb?usp=sharing


# Get emission calculations
df = get_municipalities()
print('Municipalities loaded and prepped')

df, df_transports, sector_dfs = emission_calculations(df)
print('Climate data and calculations all done')

print(df_transports)

df = car_calculations(df)
print('Hybrid car data and calculations finished')

df = get_climate_plans(df)
print('Climate plans added')

df = bicycle_calculations(df)
print('Bicycle data added')

df = get_consumption_emissions(df)
print('Consumption emission data added')

#for df_sector in sector_dfs:


df_transports = df_transports.set_index('Kommun', verify_integrity=True)
# MERGE ALL DATA IN LIST TO RULE THEM ALL

temp = []  # remane the columns
for i in range(len(df)):
    kommun = df.iloc[i]['Kommun']
    temp.append({
        'kommun': df.iloc[i]['Kommun'],
        'län': df.iloc[i]['Län'],
        'emissions': {
            '1990': df.iloc[i][1990],
            '2000': df.iloc[i][2000],
            '2005': df.iloc[i][2005],
            '2010': df.iloc[i][2010],
            '2015': df.iloc[i][2015],
            '2016': df.iloc[i][2016],
            '2017': df.iloc[i][2017],
            '2018': df.iloc[i][2018],
            '2019': df.iloc[i][2019],
            '2020': df.iloc[i][2020],
            '2021': df.iloc[i][2021]
        },
        'sectorEmissions': {
            'Transporter': {
                '1990': df_transports[1990][kommun],
                '2000': df_transports[2000][kommun],
                '2005': df_transports[2005][kommun],
                '2010': df_transports[2010][kommun],
                '2015': df_transports[2015][kommun],
                '2016': df_transports[2016][kommun],
                '2017': df_transports[2017][kommun],
                '2018': df_transports[2018][kommun],
                '2019': df_transports[2019][kommun],
                '2020': df_transports[2020][kommun],
                '2021': df_transports[2021][kommun]
            }
        },
        'budget': df.iloc[i]['Budget'],
        'emissionBudget': df.iloc[i]['parisPath'],
        'trend': df.iloc[i]['trend'],
        'futureEmission': df.iloc[i]['trendEmission'],
        'emissionChangePercent': df.iloc[i]['emissionChangePercent'],
        'hitNetZero': df.iloc[i]['hitNetZero'],
        'budgetRunsOut': df.iloc[i]['budgetRunsOut'],
        'electricCars': df.iloc[i]['electricCars'],
        'electricCarChangePercent': df.iloc[i]['electricCarChangePercent'],
        'electricCarChangeYearly': df.iloc[i]['electricCarChangeYearly'],
        'climatePlanLink': df.iloc[i]['Länk till aktuell klimatplan'],
        'climatePlanYear': df.iloc[i]['Antagen år'],
        'climatePlanComment': df.iloc[i]['Namn, giltighetsår, kommentar'],
        'bicycleMetrePerCapita': df.iloc[i]['metrePerCapita'],
        'totalConsumptionEmission': df.iloc[i]['Total emissions'],
    })

with open('output/climate-data.json', 'w', encoding='utf8') as json_file:  # save dataframe as json file
    json.dump(temp, json_file, ensure_ascii=False, default=str)

print('Climate data JSON file created and saved')

temp_df = pd.DataFrame(temp)
export_to_xlsx(temp_df)
