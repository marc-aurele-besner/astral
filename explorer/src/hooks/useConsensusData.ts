import useWallet from 'hooks/useWallet'
import { useCallback } from 'react'
import { useConsensusStates } from 'states/consensus'
import {
  ConfirmedDomainBlock,
  Deposit,
  DomainRegistry,
  DomainStakingSummary,
  Operators,
  PendingStakingOperationCount,
  RawDeposit,
  SuccessfulBundle,
  Withdrawal,
} from 'types/consensus'

export const useConsensusData = () => {
  const {
    setProperties,
    setDomain,
    setSystem,
    setDomainRegistry,
    setDomainStakingSummary,
    setLatestConfirmedDomainBlock,
    setNominatorCount,
    setOperatorIdOwner,
    setOperators,
    setPendingStakingOperationCount,
    setSuccessfulBundles,
    setDeposits,
    setWithdrawals,
  } = useConsensusStates()
  const { api } = useWallet()

  const loadData = useCallback(async () => {
    if (!api) return

    try {
      const [
        properties,
        domains,
        // system
        chain,
        name,
        // domains
        domainRegistry,
        domainStakingSummary,
        latestConfirmedDomainBlock,
        nominatorCount,
        operatorIdOwner,
        operators,
        pendingStakingOperationCount,
        successfulBundles,
      ] = await Promise.all([
        api.rpc.system.properties(),
        api.consts.domains,
        // system
        api.rpc.system.chain(),
        api.rpc.system.name(),
        api.query.domains.domainRegistry.entries(),
        api.query.domains.domainStakingSummary.entries(),
        api.query.domains.latestConfirmedDomainBlock.entries(),
        api.query.domains.nominatorCount.entries(),
        api.query.domains.operatorIdOwner.entries(),
        api.query.domains.operators.entries(),
        api.query.domains.pendingStakingOperationCount.entries(),
        api.query.domains.successfulBundles.entries(),
      ])

      setProperties({
        ss58Format: (properties.ss58Format.toPrimitive() as number[])[0],
        tokenDecimals: (properties.tokenDecimals.toPrimitive() as number[])[0],
        tokenSymbol: (properties.tokenSymbol.toJSON() as string[])[0],
        // domainsBootstrapNodes: (properties.domainsBootstrapNodes.toJSON() as string[])[0]
      })
      setDomain({
        confirmationDepthK: domains.confirmationDepthK.toHuman() as string,
        domainRuntimeUpgradeDelay: domains.domainRuntimeUpgradeDelay.toHuman() as string,
        blockTreePruningDepth: domains.blockTreePruningDepth.toHuman() as string,
        consensusSlotProbability: domains.consensusSlotProbability.toHuman() as string,
        maxDomainBlockSize: domains.maxDomainBlockSize.toHuman() as string,
        maxDomainBlockWeight: domains.maxDomainBlockWeight.toHuman() as {
          refTime: number
          proofSize: number
        },
        maxBundlesPerBlock: domains.maxBundlesPerBlock.toHuman() as string,
        maxDomainNameLength: domains.maxDomainNameLength.toHuman() as string,
        domainInstantiationDeposit: domains.domainInstantiationDeposit.toHuman() as string,
        initialDomainTxRange: domains.initialDomainTxRange.toHuman() as string,
        domainTxRangeAdjustmentInterval:
          domains.domainTxRangeAdjustmentInterval.toHuman() as string,
        minOperatorStake: domains.minOperatorStake.toJSON() as string,
        minNominatorStake: domains.minNominatorStake.toJSON() as string,
        stakeWithdrawalLockingPeriod: domains.stakeWithdrawalLockingPeriod.toJSON() as string,
        stakeEpochDuration: domains.stakeEpochDuration.toJSON() as string,
        treasuryAccount: domains.treasuryAccount.toHuman() as string,
        maxPendingStakingOperation: domains.maxPendingStakingOperation.toHuman() as number,
        palletId: domains.palletId.toHuman() as string,
        bundleLongevity: domains.bundleLongevity.toHuman() as string,
      })
      setSystem({ chain: chain.toHuman(), name: name.toHuman() })
      setDomainRegistry(
        domainRegistry.map((domain) => {
          return {
            domainId: (domain[0].toHuman() as string[])[0],
            ...(domain[1].toJSON() as Omit<DomainRegistry, 'domainId'>),
          }
        }),
      )
      setDomainStakingSummary(
        domainStakingSummary.map((domain) => domain[1].toJSON() as DomainStakingSummary),
      )
      setLatestConfirmedDomainBlock(
        latestConfirmedDomainBlock.map((domainBlock) => ({
          id: parseInt((domainBlock[0].toHuman() as string[])[0]),
          ...(domainBlock[1].toJSON() as Omit<ConfirmedDomainBlock, 'id'>),
        })),
      )
      setNominatorCount(
        nominatorCount.map((nominator) => ({
          id: parseInt((nominator[0].toHuman() as string[])[0]),
          count: nominator[1].toHuman() as number,
        })),
      )
      setOperatorIdOwner(
        operatorIdOwner.map((operator) => ({
          id: parseInt((operator[0].toHuman() as string[])[0]),
          owner: operator[1].toJSON() as string,
        })),
      )
      const formattedOperators = operators.map((operator, key) => {
        const op = operator[1].toJSON() as Omit<Operators, 'id' | 'operatorOwner'>
        return {
          id: (operator[0].toHuman() as string[])[0],
          operatorOwner: operatorIdOwner[key][1].toJSON() as string,
          ...op,
          minimumNominatorStake: parseInt(op.minimumNominatorStake, 16).toString(),
          currentTotalStake: parseInt(op.currentTotalStake, 16).toString(),
          currentTotalShares: parseInt(op.currentTotalShares, 16).toString(),
          totalStorageFeeDeposit: parseInt(op.totalStorageFeeDeposit, 16).toString(),
          status: JSON.stringify(op.status),
        } as Operators
      })
      setOperators(formattedOperators)
      setPendingStakingOperationCount(
        pendingStakingOperationCount.map(
          (stakingOp) =>
            ({
              id: parseInt((stakingOp[0].toHuman() as string[])[0]),
              count: stakingOp[1].toJSON(),
            }) as PendingStakingOperationCount,
        ),
      )
      setSuccessfulBundles(
        successfulBundles.map(
          (bundle) =>
            ({
              id: parseInt((bundle[0].toHuman() as string[])[0]),
              bundle: bundle[1].toHuman(),
            }) as SuccessfulBundle,
        ),
      )

      const deposits = await Promise.all(
        formattedOperators.map((o) => api.query.domains.deposits.entries(o.id)),
      )

      setDeposits(
        deposits.flat().map((deposit) => {
          const parsedDeposit = deposit[1].toJSON() as RawDeposit
          return {
            operatorId: parseInt((deposit[0].toHuman() as string[])[0]),
            account: (deposit[0].toHuman() as string[])[1],
            shares: parseInt(parsedDeposit.known.shares.toString(), 16).toString(),
            storageFeeDeposit: parseInt(
              parsedDeposit.known.storageFeeDeposit.toString(),
              16,
            ).toString(),
            pending: {
              amount: parsedDeposit.pending.amount.toString(),
              storageFeeDeposit: parsedDeposit.pending.storageFeeDeposit.toString(),
            },
          } as Deposit
        }),
      )
    } catch (error) {
      console.error('useConsensusData', error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api])

  const loadDataByOperatorId = useCallback(
    async (operatorId: string) => {
      if (!api) return

      try {
        const [deposits, withdrawals] = await Promise.all([
          api.query.domains.deposits.entries(operatorId),
          api.query.domains.withdrawals.entries(operatorId),
        ])

        setDeposits(
          deposits.map((deposit) => {
            const parsedDeposit = deposit[1].toJSON() as RawDeposit
            return {
              operatorId: parseInt((deposit[0].toHuman() as string[])[0]),
              account: (deposit[0].toHuman() as string[])[1],
              shares: parseInt(parsedDeposit.known.shares.toString(), 16).toString(),
              storageFeeDeposit: parseInt(
                parsedDeposit.known.storageFeeDeposit.toString(),
                16,
              ).toString(),
              pending: {
                amount: parsedDeposit.pending.amount.toString(),
                storageFeeDeposit: parsedDeposit.pending.storageFeeDeposit.toString(),
              },
            } as Deposit
          }),
        )
        setWithdrawals(
          withdrawals.map(
            (withdrawal) =>
              ({
                operatorId: parseInt((withdrawal[0].toHuman() as string[])[0]),
                ...(withdrawal[1].toJSON() as Omit<Withdrawal, 'operatorId'>),
              }) as Withdrawal,
          ),
        )
      } catch (error) {
        console.error('useConsensusData', error)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api],
  )

  return { loadData, loadDataByOperatorId }
}
