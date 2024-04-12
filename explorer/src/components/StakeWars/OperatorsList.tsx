/* eslint-disable camelcase */
'use client'

import { GET_ALL_OPERATORS } from '@/components/StakeWars/rewardsQuery'
import { bigNumberToNumber, numberWithCommas } from '@/utils/number'
import { shortString } from '@/utils/string'
import { useApolloClient, useQuery } from '@apollo/client'
import { SortingState } from '@tanstack/react-table'
import { OperatorsListCard } from 'components/StakeWars/OperatorListCard'
import { DebouncedInput } from 'components/common/DebouncedInput'
import { NewTable } from 'components/common/NewTable'
import { Spinner } from 'components/common/Spinner'
import { NotFound } from 'components/layout/NotFound'
import { PAGE_SIZE, STAKE_WARS_PHASES } from 'constants/'
import { INTERNAL_ROUTES } from 'constants/routes'
import type { OperatorsConnectionQuery } from 'gql/graphql'
import useDomains from 'hooks/useDomains'
import Link from 'next/link'
import { FC, useCallback, useMemo, useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import type { Cell } from 'types/table'
import { downloadFullData } from 'utils/downloadFullData'
import { capitalizeFirstLetter } from 'utils/string'

export const OperatorsList: FC = () => {
  const [searchOperator, setSearch] = useState<string>('')
  const [sorting, setSorting] = useState<SortingState>([{ id: 'orderingId', desc: false }])
  const [pagination, setPagination] = useState({
    pageSize: PAGE_SIZE,
    pageIndex: 0,
  })
  const apolloClient = useApolloClient()

  const { selectedChain, selectedDomain } = useDomains()

  const columns = useMemo(() => {
    const cols = [
      {
        accessorKey: 'id',
        header: 'Id',
        enableSorting: true,
        cell: ({
          row,
        }: Cell<OperatorsConnectionQuery['operatorsConnection']['edges'][0]['node']>) => (
          <Link
            data-testid={`operator-link-${row.original.id}-${row.original.signingKey}-${row.index}}`}
            className='hover:text-[#DE67E4]'
            href={INTERNAL_ROUTES.operators.id.page(
              selectedChain.urls.page,
              selectedDomain,
              row.original.id,
            )}
          >
            <div>{row.original.id}</div>
          </Link>
        ),
      },
      {
        accessorKey: 'currentDomainId',
        header: 'Domain',
        enableSorting: true,
        cell: ({
          row,
        }: Cell<OperatorsConnectionQuery['operatorsConnection']['edges'][0]['node']>) => (
          <div>{row.original.currentDomainId === 0 ? 'Subspace' : 'Nova'}</div>
        ),
      },
      {
        accessorKey: 'signingKey',
        header: 'Signing Key',
        enableSorting: true,
        cell: ({
          row,
        }: Cell<OperatorsConnectionQuery['operatorsConnection']['edges'][0]['node']>) => (
          <div className='row flex items-center gap-3'>
            <div>{shortString(row.original.signingKey)}</div>
          </div>
        ),
      },
      {
        accessorKey: 'minimumNominatorStake',
        header: 'Min. Stake',
        enableSorting: true,
        cell: ({
          row,
        }: Cell<OperatorsConnectionQuery['operatorsConnection']['edges'][0]['node']>) => (
          <div>{`${bigNumberToNumber(row.original.minimumNominatorStake)} tSSC`}</div>
        ),
      },
      {
        accessorKey: 'currentTotalStake',
        header: 'Total Stake',
        enableSorting: true,
        cell: ({
          row,
        }: Cell<OperatorsConnectionQuery['operatorsConnection']['edges'][0]['node']>) => (
          <div>{`${bigNumberToNumber(row.original.currentTotalStake)} tSSC`}</div>
        ),
      },
      {
        accessorKey: 'rewards',
        header: 'Total Rewards',
        enableSorting: true,
        cell: ({ row }) => (
          <div>{`${row.original.rewards ? bigNumberToNumber(row.original.rewards) : 0} tSSC`}</div>
        ),
      },
    ]
    return cols
  }, [selectedChain.urls.page, selectedDomain])

  const variables = useMemo(
    () => ({
      first: pagination.pageSize,
      after:
        pagination.pageIndex > 0
          ? (pagination.pageIndex * pagination.pageSize).toString()
          : undefined,
      orderBy: sorting.map((s) => `${s.id}_${s.desc ? 'DESC' : 'ASC'}`).join(',') || 'id_ASC',
      blockNumber_gte: STAKE_WARS_PHASES.phase2.start,
      blockNumber_lte: STAKE_WARS_PHASES.phase2.end,
    }),
    [pagination],
  )

  const { data, error, loading } = useQuery(GET_ALL_OPERATORS, {
    variables: variables,
    pollInterval: 6000,
    context: { clientName: 'rewards' },
  })

  useErrorHandler(error)

  const fullDataDownloader = useCallback(
    () => downloadFullData(apolloClient, GET_ALL_OPERATORS),
    [apolloClient],
  )

  const handleSearch = useCallback((value: string | number) => {
    setSearch(value.toString())
    setPagination({ ...pagination, pageIndex: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const operators = useMemo(() => data && data.operatorsConnection, [data])
  const operatorsConnection = useMemo(
    () =>
      operators &&
      operators.edges
        .map((operator: any) => ({
          ...operator.node,
          rewards: operator.node.operatorRewards.reduce((acc: bigint, reward: any) => {
            return acc + BigInt(reward.amount)
          }, BigInt(0)),
          status: operator.node.status
            ? capitalizeFirstLetter(JSON.parse(operator.node.status).__kind)
            : 'Unknown',
        }))
        .sort((a, b) => b.stake > a.stake || -(b.stake < a.stake)),
    [operators],
  )

  const totalCount = useMemo(() => (operators ? operators.totalCount : 0), [operators])
  const totalLabel = useMemo(() => numberWithCommas(Number(totalCount)), [totalCount])
  const pageCount = useMemo(
    () => Math.floor(totalCount / pagination.pageSize),
    [totalCount, pagination],
  )

  if (loading) return <Spinner />
  if (!operatorsConnection) return <NotFound />

  return (
    <div className='flex w-full flex-col align-middle'>
      <div className='flex flex-col gap-2'>
        <div className='mt-5 flex w-full justify-between'>
          <div className='text-base font-medium text-[#282929] dark:text-white'>{`Operators (${totalLabel})`}</div>
        </div>
        <DebouncedInput
          type='text'
          className='block w-full max-w-xl rounded-3xl bg-white px-4 py-[10px] text-sm text-gray-900 shadow-lg dark:bg-[#1E254E] dark:text-white'
          placeholder='Search by operator id'
          onChange={handleSearch}
          value={searchOperator}
        />
      </div>

      <div className='mt-5 flex w-full flex-col sm:mt-0'>
        <div className='my-6 rounded'>
          <NewTable
            data={operatorsConnection}
            columns={columns}
            showNavigation={false}
            sorting={sorting}
            onSortingChange={setSorting}
            pagination={pagination}
            pageCount={pageCount}
            onPaginationChange={setPagination}
            fullDataDownloader={fullDataDownloader}
            mobileComponent={<MobileComponent operators={operatorsConnection} />}
          />
        </div>
      </div>
    </div>
  )
}

type MobileComponentProps = {
  operators: OperatorsConnectionQuery['operatorsConnection']['edges'][0]['node'][]
}

const MobileComponent: FC<MobileComponentProps> = ({ operators }) => (
  <div className='w-full'>
    {operators.map((operator, index) => {
      return (
        <OperatorsListCard
          key={`operator-list-card-${operator.id}`}
          operator={operator}
          index={index}
        />
      )
    })}
  </div>
)
