'use client'

import { useQuery } from '@apollo/client'
import { Spinner } from 'components/common/Spinner'
import { NotFound } from 'components/layout/NotFound'
import { OperatorByIdQuery, Operator as TOperator } from 'gql/graphql'
import useMediaQuery from 'hooks/useMediaQuery'
import { useWindowFocus } from 'hooks/useWindowFocus'
import { useParams, useRouter } from 'next/navigation'
import { FC, useMemo } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { OperatorDetailsCard } from './OperatorDetailsCard'
import { OperatorNominatorTable } from './OperatorNominatorTable'
import { QUERY_OPERATOR_BY_ID } from './query'

export const Operator: FC = () => {
  const { operatorId } = useParams<{ operatorId?: string }>()
  const { push } = useRouter()
  const inFocus = useWindowFocus()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const variables = useMemo(() => ({ operatorId }), [operatorId])
  const { data, error, loading } = useQuery<OperatorByIdQuery>(QUERY_OPERATOR_BY_ID, {
    variables,
    skip: !inFocus,
  })

  const operator = useMemo(() => (data ? data.operatorById : []) as TOperator, [data])

  useErrorHandler(error)

  if (loading) return <Spinner />

  if (!operator) return <NotFound />

  return (
    <div className='flex w-full flex-col space-y-4'>
      <OperatorDetailsCard operator={operator} isDesktop={isDesktop} />
      <div className='mt-5 flex w-full flex-col align-middle'>
        <div className='mb-5 flex justify-between'>
          <button
            className='rounded-full bg-grayDarker p-4 px-4 py-2 text-white dark:bg-purpleAccent'
            onClick={() => push((parseInt(operator.id) - 1).toString())}
            disabled={parseInt(operator.id) === 0}
          >
            Prev Operator
          </button>
          <button
            className='rounded-full bg-grayDarker p-4 px-4 py-2  text-white dark:bg-purpleAccent'
            onClick={() => push((parseInt(operator.id) + 1).toString())}
          >
            Next Operator
          </button>
        </div>
        <div className='mt-5 flex w-full flex-col rounded-[20px] bg-white p-5 dark:bg-gradient-to-r dark:from-gradientTwilight dark:via-gradientDusk dark:to-gradientSunset sm:mt-0'>
          <OperatorNominatorTable operator={operator} />
        </div>
      </div>
    </div>
  )
}
