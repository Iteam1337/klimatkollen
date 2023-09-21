import styled, { css } from 'styled-components'
import Link from 'next/link'
import FactSection from '../FactSection'
import { ClimatePlan } from '../../utils/types'
import { H5, ParagraphItalic } from '../Typography'
import Icon from '../../public/icons/boxedArrow.svg'
import PlanIcon from '../../public/icons/climatePlan.svg'

const StyledDiv = styled.div`
  border-radius: 4px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const GreenContainer = styled.div`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 15px 15px 0 15px;
  background: ${({ theme }) => theme.midGreen};
`

const DarkContainer = styled.div`
  border-radius: 4px;
  padding: 15px 15px;
  background: ${({ theme }) => theme.lightBlack};
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 32px;
`

const SectionLeft = styled.section`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 90%;
`

const SectionRight = styled.section`
  text-align: right;
`

const ArrowIcon = styled(Icon)`
  width: 32px;
  height: 32px;
  position: absolute;
  z-index: 1;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  fill: black;
`

const LinkButton = styled.button`
  height: 36px;
  color: black;
  background: ${({ theme }) => theme.lightGreen};
  border-radius: 4px;
  border: 1px solid transparent;
  padding: 0.8rem 1rem 0.8rem 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${({ theme }) => theme.lightGreen};
  }
  & a {
    text-decoration: none;
  }
  ${({ disabled }) => disabled
    && css`
      color: ${({ theme }) => theme.lightBlack};
      background: ${({ theme }) => theme.darkGreenOne};
      cursor: not-allowed;

      /* Remove hover effect */
      &:hover {
        background: ${({ theme }) => theme.darkGreenOne};
      }

      /* Set color of ArrowIcon to lightBlack */
      & ${ArrowIcon} {
        fill: ${({ theme }) => theme.lightBlack};
      }
    `}
`

const Square = styled.div`
  width: 16px;
  height: 16px;
  position: relative;
  border-radius: 4px;
`

const CommentContainer = styled.div`
  margin-top: 8px;
`

type Props = {
  name: string
  rank: number | null
  budget: number | null
  budgetRunsOut: string
  emissionChangePercent: number
  politicalRule: Array<string> | null
  climatePlan: ClimatePlan
}

const formatter = new Intl.NumberFormat('sv-SV', { maximumSignificantDigits: 8 })

function ScoreCard({
  name,
  rank,
  budget,
  budgetRunsOut,
  emissionChangePercent,
  politicalRule,
  climatePlan,
}: Props) {
  const climatePlanYearFormatted = climatePlan.YearAdapted !== 'Saknas'
    ? `Antagen ${climatePlan.YearAdapted}`
    : climatePlan.YearAdapted
  const rankFormatted = `${rank} av 290 kommuner`
  const politicalRuleFormatted = politicalRule ? politicalRule.join(', ') : 'Data saknas'

  const handleButtonClick = () => {
    if (climatePlan.Link !== 'Saknas') {
      window.open(climatePlan.Link, '_blank')
    }
  }

  return (
    <StyledDiv>
      <GreenContainer>
        <Row>
          <SectionLeft>
            <PlanIcon />
            <H5>Klimatplan</H5>
          </SectionLeft>
          <SectionRight>
            <LinkButton
              onClick={handleButtonClick}
              disabled={climatePlan.Link === 'Saknas'}
            >
              Öppna
              <Square>
                <ArrowIcon />
              </Square>
            </LinkButton>
          </SectionRight>
        </Row>
        <FactSection
          heading={climatePlanYearFormatted}
          data=""
          info={(
            <>
              Avser nu gällande klimathandlingsplan eller motsvarande. Inte
              klimatanpassningsplaner, utsläppsbudgetar, klimatlöften, miljöpolicies eller
              liknande.
              <CommentContainer>
                <b>Kommentar:</b>
                {' '}
                {climatePlan.Comment}
              </CommentContainer>
            </>
          )}
        />
      </GreenContainer>
      <DarkContainer>
        {rank && (
          <FactSection
            heading="Kommunens utsläppsrankning"
            data={rankFormatted}
            info={(
              <>
                Genomsnittlig årlig procentuell förändring av koldioxidutsläppen sedan
                Parisavtalet 2015.
              </>
            )}
          />
        )}
        {['Gotland', 'Skövde', 'Mörbylånga'].includes(name) && (
          <ParagraphItalic>
            Utsläpp från cementproduktion exkluderad, i enlighet med IPCC:s
            koldioxidbudget, läs mer
            {' '}
            <a href="/kallor-och-metod">här</a>
          </ParagraphItalic>
        )}
        {budget && (
          <FactSection
            heading="Koldioxidbudget"
            data={`${formatter.format(Math.round(budget))} ton`}
            info={(
              <>
                Mängden koldioxid kvar att släppa ut för att klara Parisavtalets
                1,5-gradersmål, läs mer om koldioxidbudgetar
                {' '}
                <Link href="https://klimatkollen.se/Paris_compliant_Swedish_CO2_budgets-March_2022-Stoddard&Anderson.pdf">
                  här
                </Link>
                .
              </>
            )}
          />
        )}
        {budgetRunsOut && (
          <FactSection
            heading="Koldioxidbudgeten tar slut"
            data={
              budgetRunsOut === 'Aldrig'
                ? 'Med nuvarande trend håller kommunen sin budget'
                : budgetRunsOut
            }
            info={(
              <>
                Datum då kommunens koldioxidbudget tar slut om utsläppen fortsätter enligt
                nuvarande trend.
              </>
            )}
          />
        )}
        <FactSection
          heading="Utsläppsminskning för att klara Parisavtalet"
          data={`-${emissionChangePercent.toFixed(1)}% per år`}
          info={(
            <>
              Årlig procentuell utsläppsminskning som krävs för att kommunen inte ska
              överskrida sin koldioxidbudget.
            </>
          )}
        />
        {politicalRule && (
          <FactSection
            heading="Här styr"
            data={politicalRuleFormatted}
            info={(
              <>
                Uppgift om politiskt styre är hämtad från
                {' '}
                <a
                  href="https://skr.se/skr/demokratiledningstyrning/valmaktfordelning/valresultatstyren/styrekommunereftervalet2022.69547.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  Sveriges Kommuner och Regioner (SKR)
                </a>
                . Data uppdaterad mars 2023.
              </>
            )}
          />
        )}
      </DarkContainer>
    </StyledDiv>
  )
}

export default ScoreCard
