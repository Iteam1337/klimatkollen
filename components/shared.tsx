import styled from 'styled-components'
import Image from 'next/image'
import { colorTheme } from '../Theme'

// Orange
// export const mapColors = [
//   colorTheme.huePalette.orange[650],
//   colorTheme.huePalette.orange[500],
//   colorTheme.huePalette.orange[400],
//   colorTheme.huePalette.orange[350],
//   colorTheme.huePalette.orange[250],
//   colorTheme.huePalette.orange[150],
// ]

// With red, orange and blue
export const mapColors = [
  colorTheme.huePalette.red[800],
  colorTheme.huePalette.red[600],
  colorTheme.huePalette.orange[500],
  colorTheme.huePalette.orange[250],
  colorTheme.huePalette.orange[50],
  colorTheme.huePalette.blue[200],
]

// export const mapColors = [
//   colorTheme.huePalette.gray[650],
//   colorTheme.huePalette.gray[500],
//   colorTheme.huePalette.gray[350],
//   colorTheme.huePalette.gray[250],
//   colorTheme.huePalette.gray[150],
//   colorTheme.huePalette.gray[50],
// ]

/* Okto web sketches: blue */
// export const mapColors = [
//   colorTheme.newColors.blue5,
//   colorTheme.huePalette.blue[850],
//   colorTheme.newColors.blue4,
//   colorTheme.newColors.blue3,
//   colorTheme.newColors.blue2,
//   colorTheme.newColors.blue1,
// ]

export const IconButton = styled.button`
  border: none;
  cursor: pointer;
  background-color: inherit;
  color: ${({ theme }) => theme.newColors.white};
  font-size: 16px;
  line-height: 20px;
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const Square = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  border-radius: 4px;
  width: 20px;
  height: 20px;
  position: relative;
  margin-bottom: 2px;
  z-index: 40;
`

export const UnorderedList = styled.ul`
  list-style-position: inside;
  margin: 16px;
`

export const OrderedList = styled.ol`
  list-style-position: inside;
  margin: 16px;
`

export const ListItem = styled.li`
  font-size: 15px;
  margin: 8px;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 32px;
  margin: 32px 0;
`

export const GridItem = styled.div`
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > img {
    flex-shrink: 0;
  }

  & > b {
    clear: both;
    margin: 8px 0;
    font-weight: 700;
  }
`

export const GridImage = styled(Image)`
  border-radius: 50%;
`
