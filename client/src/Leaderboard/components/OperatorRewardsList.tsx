import { useApolloClient, useQuery } from '@apollo/client'
import { OperatorRewards } from 'gql/graphql'
import React, { FC, useCallback, useMemo, useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { Link } from 'react-router-dom'

// common
import { Spinner } from 'common/components'
import NewTable from 'common/components/NewTable'
import NotAllowed from 'common/components/NotAllowed'
import { PAGE_SIZE } from 'common/constants'
import { bigNumberToNumber, downloadFullData, numberWithCommas, shortString } from 'common/helpers'
import useDomains from 'common/hooks/useDomains'
import useMediaQuery from 'common/hooks/useMediaQuery'
import { INTERNAL_ROUTES } from 'common/routes'

// leaderboard
import { SortingState } from '@tanstack/react-table'
import { QUERY_OPERATORS_REWARDS_LIST } from 'Leaderboard/querys'
import OperatorRewardsListCard from './OperatorRewardsListCard'

const OperatorRewardsList = () => {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'amount', desc: true }])
  const [pagination, setPagination] = useState({
    pageSize: PAGE_SIZE,
    pageIndex: 0,
  })

  const { selectedChain } = useDomains()
  const apolloClient = useApolloClient()

  const isLargeLaptop = useMediaQuery('(min-width: 1440px)')

  const cols = useMemo(
    () => createColumns(selectedChain, pagination, isLargeLaptop),
    [selectedChain, pagination, isLargeLaptop],
  )

  const { data, error, loading } = useQuery(QUERY_OPERATORS_REWARDS_LIST, {
    variables: getQueryVariables(sorting, pagination),
    pollInterval: 6000,
  })

  useErrorHandler(error)

  const fullDataDownloader = useCallback(
    () => downloadFullData(apolloClient, QUERY_OPERATORS_REWARDS_LIST),
    [apolloClient],
  )

  if (loading) {
    return <Spinner />
  }

  if (selectedChain.title !== 'Gemini 3g' || selectedChain.isDomain) {
    return <NotAllowed />
  }

  const totalCount = data.operatorRewardsConnection.totalCount
  const pageCount = Math.floor(totalCount / pagination.pageSize)

  const operatorRewardsConnection = data.operatorRewardsConnection.edges.map(
    (operatorRewards) => operatorRewards.node,
  )

  return (
    <div className='w-full flex flex-col align-middle'>
      <div className='w-full flex flex-col sm:mt-0'>
        <div className='rounded my-6'>
          <NewTable
            data={operatorRewardsConnection}
            columns={cols}
            showNavigation={true}
            sorting={sorting}
            onSortingChange={setSorting}
            pagination={pagination}
            pageCount={pageCount}
            onPaginationChange={setPagination}
            fullDataDownloader={fullDataDownloader}
            mobileComponent={<MobileComponent operatorRewards={operatorRewardsConnection} />}
          />
        </div>
      </div>
    </div>
  )
}
export default OperatorRewardsList

const createColumns = (selectedChain, pagination, isLargeLaptop) => {
  const newCount = PAGE_SIZE * Number(pagination.pageIndex + 1) - 10

  return [
    {
      header: 'Rank',
      enableSorting: false,
      cell: ({ row }) => {
        return <div>{pagination.pageIndex + 1 > 1 ? newCount + row.index + 1 : row.index + 1}</div>
      },
    },
    {
      accessorKey: 'id',
      header: 'Operator',
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className='flex row items-center gap-3'>
            <Link
              data-testid={`account-link-${row.index}`}
              to={INTERNAL_ROUTES.operators.id.page(
                selectedChain.urls.page,
                'consensus',
                row.original.id,
              )}
              className='hover:text-[#DE67E4]'
            >
              <div>{isLargeLaptop ? row.original.id : shortString(row.original.id)}</div>
            </Link>
          </div>
        )
      },
    },
    {
      accessorKey: 'amount',
      header: 'Operator rewards',
      enableSorting: true,
      cell: ({ row }) => (
        <div>
          {row.original.amount
            ? `${numberWithCommas(bigNumberToNumber(row.original.amount))} tSSC`
            : 0}
        </div>
      ),
    },
  ]
}

const getQueryVariables = (sorting, pagination) => {
  return {
    first: pagination.pageSize,
    after:
      pagination.pageIndex > 0
        ? (pagination.pageIndex * pagination.pageSize).toString()
        : undefined,
    orderBy: sorting.length
      ? sorting.map((s) => `${s.id}_${s.desc ? 'DESC' : 'ASC'}`).join(',')
      : 'amount_DESC',
  }
}

type MobileComponentProps = {
  operatorRewards: OperatorRewards[]
}

const MobileComponent: FC<MobileComponentProps> = ({ operatorRewards }) => (
  <div className='w-full'>
    {operatorRewards.map((operator, index) => (
      <OperatorRewardsListCard
        index={index}
        operator={operator}
        key={`operator-list-card-${operator.id}`}
      />
    ))}
  </div>
)
