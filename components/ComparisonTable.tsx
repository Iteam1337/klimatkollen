import { useState } from 'react'
import { useRouter } from 'next/router'

import styled from 'styled-components'
import { getCoreRowModel, useReactTable, flexRender, SortingState, getSortedRowModel, Row } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { devices } from '../utils/devices'


const StyledTable = styled.table`
    overflow-y: auto;
    width: 100%;
    border-collapse: collapse;

    @media only screen and (${devices.mobile}) {
      font-size: 0.9em;
    }
`

const TableData = styled.td`
    padding: 0.5rem 1rem 0.2rem 0.87rem;  

    @media only screen and (${devices.mobile}) {
        padding: 0.3rem 0rem 0.1rem 0.87rem;  
    }
`

const TableHeader = styled.th`
    position: sticky;
    top: 0;
    background: ${({ theme }) => theme.darkGrey};
    padding: 1.2rem 1rem 0.2rem 0.87rem;  
    fontWeight: bold;
    text-align: left; 
`

const TableRow = styled.tr`
    :hover {
        background-color: ${({ theme }) => theme.darkGrey};
        cursor: pointer;
    }
`

type TableProps<T extends object> = {
    data: T[]
    columns: ColumnDef<T>[]
}

const ComparisonTable = <T extends object>({ data, columns }: TableProps<T>) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const router = useRouter()

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    const handleRowClick = (row: Row<T>) => {
        const cells = row.getAllCells()
        const value = cells.at(1)?.renderValue()
        const url = typeof value === 'string' ? `/kommuner/kommun/${value.toLowerCase()}` : '/404'
        router.push(url)
    }

    return (
        <StyledTable>
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                            <TableHeader key={header.id} colSpan={header.colSpan}>
                                {header.isPlaceholder ? null : (
                                    <div
                                        {...{
                                            className: header.column.getCanSort()
                                                ? 'cursor-pointer select-none'
                                                : '',
                                            onClick: header.column.getToggleSortingHandler(),
                                        }}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: ' ↑',
                                            desc: ' ↓',
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </div>
                                )}
                            </TableHeader>
                        )
                    })}
                </tr>
            ))}
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} onClick={() => handleRowClick(row)}>
                        {row.getVisibleCells().map((cell) => (
                            <TableData key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableData>
                        ))}
                    </TableRow>
                ))}
            </tbody>
        </StyledTable>
    );
}

export default ComparisonTable