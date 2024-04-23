import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import styled from 'styled-components'
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  SortingState,
  getSortedRowModel,
  Row,
  Header,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { devices } from '../utils/devices'

const StyledTable = styled.table`
  width: 98%;
  margin-left: 1%;
  overflow-y: auto;
  border-collapse: collapse;

  @media only screen and (${devices.mobile}) {
    font-size: 0.8em;
  }

  #first-header {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  #third-header {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .data-header {
    text-align: right;
  }

  .data-column {
    color: ${({ theme }) => theme.darkYellow};
    text-align: right;
  }
`

const TableData = styled.td`
  padding: 8px 6px;
  max-width: 80px;
  border-bottom: 1px solid ${({ theme }) => theme.midGreen};

  @media only screen and (${devices.tablet}) {
    padding: 16px;
  }
`

const TableHeader = styled.th`
  padding: 12px 6px;
  background: ${({ theme }) => theme.black};
  position: sticky;
  top: 0;
  font-weight: bold;
  text-align: left;
  cursor: pointer;

  @media only screen and (${devices.tablet}) {
    padding: 16px 8px 16px 12px;
  }
`

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.midGreen};
  :hover {
    cursor: pointer;
  }
`

type TableProps<T extends object> = {
  data: T[]
  columns: ColumnDef<T>[]
}

function ComparisonTable<T extends object>({ data, columns }: TableProps<T>) {
  // IDEA: Maybe we could set a default sorting state for columns, and then disable the possibility to remove sorting,
  // thus keeping it only toggling between "desc" and "asc"
  const [sorting, setSorting] = useState<SortingState>([])
  const router = useRouter()

  const [resizeCount, setResizeCount] = useState(0)

  useEffect(() => {
    const handleResize = () => setResizeCount((count) => count + 1)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    // onSortingChange: (updater) => {
    //   // IDEA: We might be able to do something with this.
    //   // For example, to communicate acrosss modules, we could move the state out to a hook, and then use a global variable (singleton)
    //   // combined with a getter function to get the current sorting state. This way, we could show determine the sort order.
    //   const newSortingValue = updater instanceof Function ? updater(sorting) : updater

    //   console.log(sorting[0], newSortingValue[0])

    //   setSorting(updater)
    // },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const handleRowClick = (row: Row<T>) => {
    const cells = row.getAllCells()
    const value = cells.at(1)?.renderValue()
    const route = typeof value === 'string' ? `/kommun/${value.toLowerCase()}` : '/404'
    router.push(route)
  }

  const renderHeader = (header: Header<T, unknown>, index: number) => {
    const lastOrMiddleHeader = index === header.headerGroup.headers.length - 1 ? 'third-header' : 'second-header'

    return (
      <TableHeader
        key={header.id}
        colSpan={header.colSpan}
        className={header.index > 1 ? 'data-header' : ''}
        id={index === 0 ? 'first-header' : lastOrMiddleHeader}
        onClick={header.column.getToggleSortingHandler()}
        onKeyDown={header.column.getToggleSortingHandler()}
      >
        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
      </TableHeader>
    )
  }

  return (
    <StyledTable key={resizeCount}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header, index) => renderHeader(header, index))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} onClick={() => handleRowClick(row)}>
            {row.getVisibleCells().map((cell, columnIndex) => (
              <TableData key={cell.id} className={columnIndex > 1 ? 'data-column' : ''}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableData>
            ))}
          </TableRow>
        ))}
      </tbody>
    </StyledTable>
  )
}

export default ComparisonTable
