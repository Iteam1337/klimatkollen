import Head from 'next/head'
import DropDown from '../components/DropDown'
import Map from '../components/Map'
import { H1, Paragraph } from '../components/Typography'
import { Municipality } from '../utils/types'

type PropsType = {
  municipalities: Array<Municipality>
}

const Home: React.FC<PropsType> = ({ municipalities }: PropsType) => {
  const municipalitiesName = municipalities.map((item) => item.Name)
  return (
    <>
      <Head>
        <title>Klimatkollen</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <H1>Klimatkollen</H1>
      <Paragraph>
        Låt oss ta tempen på hur väl din kommun når upp till de mål som är uppsatta i
        parisavtalet.
      </Paragraph>
      <DropDown municipalitiesName={municipalitiesName} />
      <Map />
    </>
  )
}

export async function getServerSideProps() {
  const municipalities = await fetch(
    'http://klimatkollen.vercel.app/api/municipalities',
  ).then((res) => res.json())
  return {
    props: { municipalities },
  }
}

export default Home
