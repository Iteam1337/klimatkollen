import styled from 'styled-components'
import { H2, H5, Paragraph } from '../Typography'
import FactSection from '../FactSection'
import { Municipality } from '../../utils/types'
import EVCar from '../../public/icons/evcars_32.svg'
import Bike from '../../public/icons/bikelanes_32.svg'
import Basket from '../../public/icons/consumtion_32.svg'
import Charger from '../../public/icons/charger.svg'
import { requirementsInProcurement } from '../../utils/datasetDefinitions'

const StyledH2 = styled(H2)`
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
`

const StyledH5 = styled(H5)`
  margin: 32px 0 32px 16px;
`

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`

type SolutionSectionProps = {
  icon: JSX.Element
  title: string
  heading: string
  data: string
  info: string | JSX.Element
}

function SolutionSection({
  icon, title, heading, data, info,
}: SolutionSectionProps) {
  return (
    <>
      <FlexContainer>
        {icon}
        <StyledH5>{title}</StyledH5>
      </FlexContainer>
      <FactSection heading={heading} data={data} info={info} />
    </>
  )
}

type SolutionsProps = {
  municipality: Municipality
}

function MunicipalitySolutions({ municipality }: SolutionsProps) {
  return (
    <>
      <StyledH2>Omställning</StyledH2>
      <Paragraph>
        Här visas nyckeltal för hur det går med klimatomställningen i kommunerna.
      </Paragraph>
      <SolutionSection
        icon={<Basket />}
        title="Hushållens konsumtionsutsläpp"
        heading="CO₂e per person och år"
        data={`${municipality.TotalConsumptionEmission.toFixed(1)} ton`}
        info="Hushållens konsumtionsutsläpp (CO₂e) i ton per invånare år 2019."
      />
      <SolutionSection
        icon={<Basket />}
        title="Klimatkrav i upphandlingar"
        heading="Ställer kommunen klimatkrav i sina upphandlingar?"
        data={requirementsInProcurement(municipality.ProcurementScore)}
        info={(
          <>
            Kommuner som ställer klimatkrav vid offentliga upphandlingar.
            “Ja” innebär principbeslut och underlag som tillstyrker.
            “Kanske” innebär ja-svar i enkätundersökning eller via mejl, men utan underlag som tillstyrker.
            {' '}
            <a href="mailto:hej@klimatkollen.se">
              Mejla oss
            </a>
            {' '}
            för att redigera informationen.
          </>
        )}
      />
      <SolutionSection
        icon={<EVCar />}
        title="Elbilarna"
        heading="Förändringstakt andel laddbara bilar"
        data={`${(municipality.ElectricCarChangePercent * 100).toFixed(1)} procentenheter`}
        info="Ökningstakten för andelen nyregistrerade laddbara bilar sedan Parisavtalet
            2015 i procentenheter per år."
      />
      <SolutionSection
        icon={<Charger />}
        title="Laddarna"
        heading="Antal elbilar per laddare"
        data={`${municipality.ElectricVehiclePerChargePoints < 1e10 ? municipality.ElectricVehiclePerChargePoints.toFixed(1) : 'Laddare saknas'}`}
        info="Antal registrerade laddbara bilar per offentliga laddpunkter år 2023. EU rekommenderar max 10 bilar per laddare."
      />
      <SolutionSection
        icon={<Bike />}
        title="Cyklarna"
        heading="Antal meter cykelväg per invånare"
        data={`${municipality.BicycleMetrePerCapita.toFixed(1)} meter`}
        info="Antal meter cykelväg per invånare år 2022 totalt för alla väghållare (statlig, kommunal, enskild)."
      />
    </>
  )
}

export default MunicipalitySolutions
