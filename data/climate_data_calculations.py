# -*- coding: utf-8 -*-

import datetime
import json
from cars.car_data_calculations import car_calculations
from emissions.emission_data_calculations import emission_calculations
from plans.plans_data_prep import get_climate_plans
import pandas as pd


# Get emission calculations
df = emission_calculations()
df = car_calculations(df)
df = get_climate_plans(df)

# MERGE ALL DATA IN LIST TO RULE THEM ALL

temp = []  # remane the columns
for i in range(len(df_cem)):
    temp.append({
        'kommun': df_master.iloc[i]['Kommun'],
        'emissions': {
            '1990': df_master.iloc[i][1990],
            '2000': df_master.iloc[i][2000],
            '2005': df_master.iloc[i][2005],
            '2010': df_master.iloc[i][2010],
            '2015': df_master.iloc[i][2015],
            '2016': df_master.iloc[i][2016],
            '2017': df_master.iloc[i][2017],
            '2018': df_master.iloc[i][2018],
            '2019': df_master.iloc[i][2019],
            '2020': df_master.iloc[i][2020]
        },
        'budget': df.iloc[i]['Budget'],
        'emissionBudget': df.iloc[i]['Paris Path'],
        'trend': df.iloc[i]['Linear Path'],
        'futureEmission': df.iloc[i]['Linear Emission'],
        'emissionChangePercent': df.iloc[i]['emissionChangePercent'],
        'hitNetZero': df.iloc[i]['hitNetZero'],
        'budgetRunsOut': df.iloc[i]['budgetRunsOut'],
        'electricCars': df.iloc[i]['electricCars'],
        'electricCarChangePercent': df.iloc[i]['electricCarChangePercent'],
        'electricCarChangeYearly': df.iloc[i]['electricCarChangeYearly'],
        'climatePlanLink': df.iloc[i]['Länk till aktuell klimatplan'],
        'climatePlanYear': df.iloc[i]['Antagen år'],
        'climatePlanComment': df.iloc[i]['Namn, giltighetsår, kommentar']
    })

with open('climate-data.json', 'w', encoding='utf8') as json_file:  # save dataframe as json file
    json.dump(temp, json_file, ensure_ascii=False, default=str)
