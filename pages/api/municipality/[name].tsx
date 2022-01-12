import type { NextApiRequest, NextApiResponse } from 'next'
import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';
import Municipality from '../../kommun/[municipality]';

type MunicipalityData = {
  Huvudsektor: string
  Undersektor: string
  Län: string
  Kommun: string
  1990: number
  2000: number
  2005: number
  2010: number
  2011: number
  2012: number
  2013: number
  2014: number
  2015: number
  2016: number
  2017: number
  2018: number
  2019: number
};

type Municipality = {
  County: string
  Name: string
  Emissions: Array<Emission>
};

type Emission = {
  Year: string,
  CO2equivalent: number
}

export default function userHandler(req: NextApiRequest, res: NextApiResponse) {
    
    const name = req.query.name as string;
    const method = req.method as string;
  
    switch (method) {
      case 'GET':
        
        const csvFilePath = path.resolve('./resources/emissions_per_municipality.csv');

        const headers = ['Huvudsektor', 'Undersektor', 'Län', 'Kommun', '1990', '2000', '2005', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'];

        const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

        parse(fileContent, {
          delimiter: ';',
          columns: headers,
          fromLine:9,
          cast: (columnValue, context) => {
            const columnName = context.column as string
            if (['1990', '2000', '2005', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'].includes(columnName)) {
              return parseInt(columnValue, 10);
            }
            return columnValue;
          },
          on_record: (line, context) => {
            if (line.Huvudsektor != 'Alla' && line.Kommun != 'Alla') {
              return;
            }

            if (line.Kommun.toLowerCase() != name.toLowerCase()){
              return;
            }
      
            return line;
          },
        }, (error, result: MunicipalityData[]) => {
          if (error) {
            console.log('#### ERROR #####')
            console.error(error);
          }

          const municipalities : Array<Municipality> = result.map((municipalityData:MunicipalityData) => {
            return {
              Name : municipalityData.Kommun,
              County : municipalityData.Län,
              Emissions: [
                { Year: "1990", CO2equivalent: municipalityData[1990] },
                { Year: "2000", CO2equivalent: municipalityData[2000] },
                { Year: "2005", CO2equivalent: municipalityData[2005] },
                { Year: "2010", CO2equivalent: municipalityData[2010] },
                { Year: "2011", CO2equivalent: municipalityData[2011] },
                { Year: "2012", CO2equivalent: municipalityData[2012] },
                { Year: "2013", CO2equivalent: municipalityData[2013] },
                { Year: "2014", CO2equivalent: municipalityData[2014] },
                { Year: "2015", CO2equivalent: municipalityData[2015] },
                { Year: "2016", CO2equivalent: municipalityData[2016] },
                { Year: "2017", CO2equivalent: municipalityData[2017] },
                { Year: "2018", CO2equivalent: municipalityData[2018] },
                { Year: "2019", CO2equivalent: municipalityData[2019] }
              ]
            }
          })

          // Get data from your database
          res.status(200).json(municipalities.shift())
        });

        break
      // case 'PUT':  
      //   // Update or create data in your database
      //   res.status(200).json({ id, name: name || `User ${id}` })
      //   break
      default:
        res.setHeader('Allow', ['GET', 'PUT'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  }