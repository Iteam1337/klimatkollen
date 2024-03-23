import pandas as pd


# calculations based on trafa data
PATH_CARS_DATA = "solutions/cars/sources/kpi1_calculations.xlsx"


def get_electric_car_change_rate(df):
    # LOAD AND PREP DATA ON CHANGE RATE OF PERCENTAGE OF NEWLY REGISTERED RECHARGABLE CARS PER MUNICIPALITY AND YEAR
    df_raw_cars = pd.read_excel(PATH_CARS_DATA)

    df_raw_cars.columns = df_raw_cars.iloc[1]  # name columns after row
    df_raw_cars = df_raw_cars.drop([0, 1])  # drop usless rows
    df_raw_cars = df_raw_cars.reset_index(drop=True)

    df_raw_cars["electricCarChangePercent"] = df_raw_cars[
        "Procentenheter förändring av andel laddbara bilar 2015-2022"
    ]
    
    years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]
    df_raw_cars["electricCarChangeYearly"] = df_raw_cars.apply(
        lambda x: {year: x.loc[year] for year in years},
        axis=1
    )

    df_cars = df_raw_cars.filter(
        ["Kommun", "electricCarChangePercent", "electricCarChangeYearly"], axis=1
    )

    df = df.merge(df_cars, on="Kommun", how="left")

    return df