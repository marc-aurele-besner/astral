import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v0 from '../v0'
import * as v1 from '../v1'
import * as v2 from '../v2'
import * as v3 from '../v3'

export const bundleStored =  {
    name: 'Domains.BundleStored',
    /**
     * A domain bundle was included.
     */
    v0: new EventType(
        'Domains.BundleStored',
        sts.struct({
            domainId: v0.DomainId,
            bundleHash: v0.H256,
            bundleAuthor: sts.bigint(),
        })
    ),
}

export const domainRuntimeCreated =  {
    name: 'Domains.DomainRuntimeCreated',
    v0: new EventType(
        'Domains.DomainRuntimeCreated',
        sts.struct({
            runtimeId: sts.number(),
            runtimeType: v0.RuntimeType,
        })
    ),
}

export const domainRuntimeUpgradeScheduled =  {
    name: 'Domains.DomainRuntimeUpgradeScheduled',
    v0: new EventType(
        'Domains.DomainRuntimeUpgradeScheduled',
        sts.struct({
            runtimeId: sts.number(),
            scheduledAt: sts.number(),
        })
    ),
}

export const domainRuntimeUpgraded =  {
    name: 'Domains.DomainRuntimeUpgraded',
    v0: new EventType(
        'Domains.DomainRuntimeUpgraded',
        sts.struct({
            runtimeId: sts.number(),
        })
    ),
}

export const operatorRegistered =  {
    name: 'Domains.OperatorRegistered',
    v0: new EventType(
        'Domains.OperatorRegistered',
        sts.struct({
            operatorId: sts.bigint(),
            domainId: v0.DomainId,
        })
    ),
}

export const operatorNominated =  {
    name: 'Domains.OperatorNominated',
    v0: new EventType(
        'Domains.OperatorNominated',
        sts.struct({
            operatorId: sts.bigint(),
            nominatorId: v0.AccountId32,
        })
    ),
}

export const domainInstantiated =  {
    name: 'Domains.DomainInstantiated',
    v0: new EventType(
        'Domains.DomainInstantiated',
        sts.struct({
            domainId: v0.DomainId,
        })
    ),
}

export const operatorSwitchedDomain =  {
    name: 'Domains.OperatorSwitchedDomain',
    v0: new EventType(
        'Domains.OperatorSwitchedDomain',
        sts.struct({
            oldDomainId: v0.DomainId,
            newDomainId: v0.DomainId,
        })
    ),
}

export const operatorDeregistered =  {
    name: 'Domains.OperatorDeregistered',
    v0: new EventType(
        'Domains.OperatorDeregistered',
        sts.struct({
            operatorId: sts.bigint(),
        })
    ),
}

export const withdrewStake =  {
    name: 'Domains.WithdrewStake',
    v0: new EventType(
        'Domains.WithdrewStake',
        sts.struct({
            operatorId: sts.bigint(),
            nominatorId: v0.AccountId32,
        })
    ),
}

export const preferredOperator =  {
    name: 'Domains.PreferredOperator',
    v0: new EventType(
        'Domains.PreferredOperator',
        sts.struct({
            operatorId: sts.bigint(),
            nominatorId: v0.AccountId32,
        })
    ),
}

export const operatorRewarded =  {
    name: 'Domains.OperatorRewarded',
    v0: new EventType(
        'Domains.OperatorRewarded',
        sts.struct({
            operatorId: sts.bigint(),
            reward: sts.bigint(),
        })
    ),
}

export const domainEpochCompleted =  {
    name: 'Domains.DomainEpochCompleted',
    v0: new EventType(
        'Domains.DomainEpochCompleted',
        sts.struct({
            domainId: v0.DomainId,
            completedEpochIndex: sts.number(),
        })
    ),
}

export const fraudProofProcessed =  {
    name: 'Domains.FraudProofProcessed',
    v0: new EventType(
        'Domains.FraudProofProcessed',
        sts.struct({
            domainId: v0.DomainId,
            newHeadReceiptNumber: sts.option(() => sts.number()),
        })
    ),
    v1: new EventType(
        'Domains.FraudProofProcessed',
        sts.struct({
            domainId: v1.DomainId,
            newHeadReceiptNumber: sts.number(),
        })
    ),
    v2: new EventType(
        'Domains.FraudProofProcessed',
        sts.struct({
            domainId: v2.DomainId,
            newHeadReceiptNumber: sts.option(() => sts.number()),
        })
    ),
}

export const domainOperatorAllowListUpdated =  {
    name: 'Domains.DomainOperatorAllowListUpdated',
    v0: new EventType(
        'Domains.DomainOperatorAllowListUpdated',
        sts.struct({
            domainId: v0.DomainId,
        })
    ),
}

export const forceDomainEpochTransition =  {
    name: 'Domains.ForceDomainEpochTransition',
    v3: new EventType(
        'Domains.ForceDomainEpochTransition',
        sts.struct({
            domainId: v3.DomainId,
            completedEpochIndex: sts.number(),
        })
    ),
}

export const operatorSlashed =  {
    name: 'Domains.OperatorSlashed',
    v3: new EventType(
        'Domains.OperatorSlashed',
        sts.struct({
            operatorId: sts.bigint(),
            reason: v3.SlashedReason,
        })
    ),
}
