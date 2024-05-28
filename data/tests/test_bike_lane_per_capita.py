# -*- coding: utf-8 -*-
import unittest
import pandas as pd

from solutions.bicycles.bicycle_data_calculations import calculate_bike_lane_per_capita


class TestBicycleCalculations(unittest.TestCase):
    
    def test_calculate_bike_lane_per_capita(self):
        df_expected = pd.DataFrame(
            {
                "Kommun": ["Ale", "Alingsås", "Alvesta"],
                "bikeLanePerCapita": [91548/32446, 122012/42382, 66699/20040],
            }
        )

        df_result = calculate_bike_lane_per_capita()

        pd.testing.assert_frame_equal(df_result.iloc[:3], df_expected, check_dtype=False)

if __name__ == "__main__":
    unittest.main()
