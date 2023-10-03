import styled from 'styled-components'
import { H2, H5, Paragraph } from '../Typography'
import FactSection from '../FactSection'
import { Municipality } from '../../utils/types'
import EVCar from '../../public/icons/ev_car.svg'
import Bike from '../../public/icons/bike.svg'
import Basket from '../../public/icons/basket_fill.svg'

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
  info: string
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
        icon={<EVCar />}
        title="Elbilarna"
        heading="Förändringstakt andel laddbara bilar"
        data={`${(municipality.ElectricCarChangePercent * 100).toFixed(1)}%`}
        info="Ökningstakten för andelen nyregistrerade laddbara bilar sedan Parisavtalet
            2015 i procentenheter per år."
      />
      <SolutionSection
        icon={<Bike />}
        title="Cyklarna"
        heading="Antal meter cykelväg per invånare"
        data={`${municipality.BicycleMetrePerCapita.toFixed(1)} meter`}
        info="Antal meter cykelväg per invånare år 2022 totalt för alla väghållare (statlig, kommunal, enskild)."
      />
      <SolutionSection
        icon={<Basket />}
        title="Hushållens konsumtionsutsläpp"
        heading="Ton CO₂e/person och år"
        data={`${municipality.TotalConsumptionEmission.toFixed(1)} ton/person och år`}
        info="Hushållens konsumtionsutsläpp (CO₂e) i ton per invånare år 2019."
      />
    </>
  )
}

export default MunicipalitySolutions
