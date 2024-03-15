'use client'

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { LogoIcon, WalletIcon } from '@/components/icons'
import { formatUnitsToNumber } from '@/utils/number'
import { HeaderBackground } from 'components/layout/HeaderBackground'
import { chains } from 'constants/chains'
import dayjs from 'dayjs'
import useDomains from 'hooks/useDomains'
import useMediaQuery from 'hooks/useMediaQuery'
import useWallet from 'hooks/useWallet'
import { useRouter } from 'next/navigation'
import { SelectedChainProvider } from 'providers/ChainProvider'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { AccountHeader } from './AccountHeader'
import { AccountSummary } from './AccountSummary'
import { LastExtrinsics } from './LastExtrinsics'
import { Leaderboard } from './Leaderboard'
import { StakingSummary } from './StakingSummary'

type DrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export const WalletSidekick: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const onClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setIsOpen(true)
  }, [])
  const onClose = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <button
        onClick={onClick}
        className={`inline-flex items-center bg-white p-2 text-base hover:bg-gray-200 focus:outline-none ${
          isDesktop ? 'ml-4 rounded-full' : 'rounded-r-full'
        } from-[#EA71F9] to-[#4D397A] shadow-md dark:bg-gradient-to-r`}
      >
        <WalletIcon width='24' height='24' />
      </button>
      <Drawer isOpen={isOpen} onClose={onClose} />
    </>
  )
}

const Drawer: FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { push } = useRouter()
  const { selectedChain, selectedDomain } = useDomains()
  const { api, actingAccount, subspaceAccount } = useWallet()
  const [tokenSymbol, setTokenSymbol] = useState<string>('')
  const [walletBalance, setWalletBalance] = useState<number>(0)

  const consensusChain = useMemo(
    () => chains.find((chain) => chain.urls.page === selectedChain.urls.page) ?? chains[0],
    [selectedChain],
  )
  const consensusApi = useMemo(() => api && api[consensusChain.urls.page], [api, consensusChain])

  const handleNavigate = useCallback(
    (url: string) => {
      onClose()
      push(url)
    },
    [onClose, push],
  )

  const loadData = useCallback(async () => {
    if (!consensusApi) return

    const properties = await consensusApi.rpc.system.properties()
    setTokenSymbol((properties.tokenSymbol.toJSON() as string[])[0])
  }, [consensusApi])

  const loadWalletBalance = useCallback(async () => {
    if (!consensusApi || !actingAccount) return

    const balance = await consensusApi.query.system.account(actingAccount.address)
    setWalletBalance(
      formatUnitsToNumber((balance.toJSON() as { data: { free: string } }).data.free),
    )
  }, [consensusApi, actingAccount])

  useEffect(() => {
    loadData()
  }, [consensusApi, loadData])

  useEffect(() => {
    loadWalletBalance()
  }, [consensusApi, actingAccount, loadWalletBalance])

  if (!subspaceAccount || !actingAccount) return null

  return (
    // backdrop
    <div onClick={onClose}>
      <nav
        className={
          'fixed inset-0 z-10 transform overflow-hidden bg-gray-900 bg-opacity-25 ease-in-out ' +
          (isOpen
            ? ' z-max translate-x-0 opacity-100 transition-opacity duration-500'
            : ' translate-x-full opacity-0 transition-all delay-500')
        }
      >
        <section
          onClick={(e) => e.stopPropagation()}
          className={
            'delay-400 absolute right-0 -z-10 h-full w-screen max-w-lg transform bg-light shadow-xl transition-all duration-500 ease-in-out dark:bg-dark' +
            (isOpen ? ' translate-x-0 ' : ' translate-x-full ')
          }
        >
          <HeaderBackground />
          <article className='relative flex h-full w-screen max-w-lg flex-col gap-2 overflow-y-scroll pb-10'>
            <div className='flex items-center justify-between p-5 align-middle'>
              <button
                onClick={() => handleNavigate(`/${selectedChain.urls.page}/${selectedDomain}`)}
                className='title-font flex items-center font-medium text-gray-900 dark:text-white'
              >
                <LogoIcon fillColor='currentColor' />
              </button>
              <div className='flex items-center gap-3'>
                <button
                  className='items-center rounded-full bg-white px-4 py-2 dark:bg-[#1E254E] dark:text-white'
                  onClick={onClose}
                >
                  x
                </button>
              </div>
            </div>
            <SelectedChainProvider selectedChain={consensusChain}>
              <AccountHeader
                subspaceAccount={subspaceAccount}
                walletBalance={walletBalance}
                tokenSymbol={tokenSymbol}
              />
              <AccountSummary
                subspaceAccount={subspaceAccount}
                selectedChain={consensusChain}
                actingAccountName={actingAccount.name}
                walletBalance={walletBalance}
                tokenSymbol={tokenSymbol}
              />
              <StakingSummary
                subspaceAccount={subspaceAccount}
                selectedChain={consensusChain}
                tokenSymbol={tokenSymbol}
              />
              <LastExtrinsics subspaceAccount={subspaceAccount} selectedChain={consensusChain} />
              <Leaderboard subspaceAccount={subspaceAccount} />
            </SelectedChainProvider>
            <div className='flex'>
              <div className='flex flex-col flex-wrap justify-items-end pb-1 pl-5 pt-10 sm:hidden sm:flex-row'>
                <p className='text-gray text-center text-sm sm:text-left'>
                  © {dayjs().year()} Subspace Labs, Inc. All Rights Reserved
                </p>
              </div>
            </div>
          </article>
        </section>
      </nav>
    </div>
  )
}
