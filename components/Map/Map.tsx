/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components'
import DeckGL, { PolygonLayer, RGBAColor } from 'deck.gl'
import { ReactNode, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import NextNProgress from 'nextjs-progressbar'
import { colorTheme } from '../../Theme'
import { mapColors } from '../shared'
import { replaceLetters } from '../../utils/shared'

const INITIAL_VIEW_STATE = {
  longitude: 17.062927,
  latitude: 63,
  zoom: 3.5,
  minZoom: 3,
  pitch: 0,
  bearing: 0,
}

const DeckGLWrapper = styled.div`
  height: 100%;
`

const hexToRGBA = (hex: string): RGBAColor => {
  const hexValue = hex.replace('#', '')
  const red = parseInt(hexValue.substring(0, 2), 16)
  const green = parseInt(hexValue.substring(2, 4), 16)
  const blue = parseInt(hexValue.substring(4, 6), 16)
  return [red, green, blue]
}

const getColor = (
  dataPoint: number | string,
  boundaries: number[] | string[] | Date[],
): RGBAColor => {
  const colors: RGBAColor[] = mapColors.map(hexToRGBA)

  // Special case for binary KPIs
  if (boundaries.length === 2) {
    return dataPoint === boundaries[0] ? colors[0] : colors[colors.length - 1]
  }

  // Special case for KPIs with three cases
  if (boundaries.length === 3) {
    if (dataPoint > boundaries[1]) return colors[colors.length - 1]
    if (dataPoint > boundaries[0]) return colors[4]
    return colors[0]
  }

  // Special case for invalid dates
  const invalidDate = (possibleDate: unknown) => possibleDate instanceof Date && Number.isNaN(possibleDate.getTime())
  if (invalidDate(dataPoint)) {
    return colors[colors.length - 1]
  }

  const ascending = boundaries[0] < boundaries[1]

  if (ascending) {
    for (let i = boundaries.length - 1; i >= 0; i -= 1) {
      if (dataPoint >= boundaries[i]) {
        return colors[i + 1]
      }
    }
    return colors[0]
  }

  for (let i = 0; i < boundaries.length; i += 1) {
    if (dataPoint >= boundaries[i]) {
      return colors[i]
    }
  }
  return colors[5]
}

type MapProps = {
  data: Array<{
    name: string
    dataPoint: number | string | Date
    formattedDataPoint: number | string
  }>
  boundaries: number[] | string[] | Date[]
  children?: ReactNode
}

function Map({ data, boundaries, children }: MapProps) {
  const [municipalityData, setMunicipalityData] = useState<any>({})
  const router = useRouter()

  const [initialViewState, setInitialViewState] = useState(INITIAL_VIEW_STATE)

  // Update zoom based on window size
  const updateZoom = () => {
    let newZoom = 3.5
    const width = window.innerWidth

    if (width <= 768) {
      // Tablet or mobile
      newZoom = 3
    }

    setInitialViewState((prevState) => ({
      ...prevState,
      zoom: newZoom,
    }))
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/map')
      setMunicipalityData(response.data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', updateZoom)
    updateZoom() // Initial call to set correct zoom

    // Cleanup
    return () => window.removeEventListener('resize', updateZoom)
  }, [])

  const municipalityLines = municipalityData?.features?.flatMap(
    ({ geometry, properties }: { geometry: any; properties: any }) => {
      const name = replaceLetters(properties.name)
      const dataPoint = data.find((e) => e.name === name)?.dataPoint
      const formattedDataPoint = data.find((e) => e.name === name)?.formattedDataPoint

      if (geometry.type === 'MultiPolygon') {
        return geometry.coordinates.map((coords: any) => ({
          geometry: coords[0],
          name,
          dataPoint,
          formattedDataPoint,
        }))
      }
      return [
        {
          geometry: geometry.coordinates[0][0],
          name,
          dataPoint,
          formattedDataPoint,
        },
      ]
    },
  )

  type MunicipalityData = {
    name: string
    dataPoint: number
    formattedDataPoint: number
    geometry: [number, number][]
  }

  const municipalityLayer = new PolygonLayer({
    id: 'polygon-layer',
    data: municipalityLines,
    stroked: true,
    filled: true,
    extruded: false,
    wireframe: false,
    lineWidthUtils: 'pixels',
    lineWidthMinPixels: 0.5,
    getLineWidth: 80,
    lineJointRounded: true,
    getElevation: 0,
    polygonOffset: 1,
    getPolygon: (k: any) => k.geometry,
    getLineColor: () => [0, 0, 0, 80],
    getFillColor: (d) => getColor((d as MunicipalityData).dataPoint, boundaries),
    pickable: true,
  })

  return (
    <DeckGLWrapper>
      <NextNProgress
        color={colorTheme.darkGreenOne}
        startPosition={0.3}
        stopDelayMs={20}
        height={5}
        showOnShallow={false}
        options={{
          showSpinner: false,
        }}
      />
      <DeckGL
        initialViewState={initialViewState}
        controller={{}}
        getTooltip={({ object }) => object && {
          html: `
          <p>${(object as unknown as MunicipalityData)?.name}: ${(object as unknown as MunicipalityData).formattedDataPoint}</p>`,
          style: {
            backgroundColor: 'black',
            borderRadius: '5px',
            fontSize: '0.7em',
            color: colorTheme.offWhite,
          },
        }}
        onClick={({ object }) => {
          // IDK what the correct type is
          const name = (object as unknown as MunicipalityData)?.name
          if (name) router.push(`/kommun/${replaceLetters(name).toLowerCase()}`)
        }}
        layers={[municipalityLayer]}
        // FIXME needs to be adapted to mobile before reintroducing
        /* onViewStateChange={({ viewState }) => {
        viewState.longitude = Math.min(MAP_RANGE.lon[1], Math.max(MAP_RANGE.lon[0], viewState.longitude))
        viewState.latitude = Math.min(MAP_RANGE.lat[1], Math.max(MAP_RANGE.lat[0], viewState.latitude))
        return viewState
      }} */
      />
      {children}
    </DeckGLWrapper>
  )
}

export default Map
