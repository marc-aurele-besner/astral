import { AvailableColumns, FiltersOptions, InitialTables } from 'types/table'
import { PAGE_SIZE } from './general'

export const AVAILABLE_COLUMNS: AvailableColumns = {
  domains: [
    { name: 'id', label: 'Id', isSelected: true, searchable: true },
    { name: 'account_id', label: 'Owner', isSelected: true, searchable: true },
    { name: 'name', label: 'Name', isSelected: true, searchable: true },
    { name: 'runtime_id', label: 'Runtime Id', isSelected: false },
    { name: 'runtime', label: 'Runtime', isSelected: true },
    { name: 'runtime_info', label: 'Runtime Info', isSelected: false },
    { name: 'completed_epoch', label: 'Completed Epoch', isSelected: true },
    { name: 'last_domain_block_number', label: 'Last Domain Block Number', isSelected: false },
    { name: 'total_deposits', label: 'Total Deposits', isSelected: true },
    {
      name: 'total_estimated_withdrawals',
      label: 'Total Estimated Withdrawals',
      isSelected: false,
    },
    { name: 'total_withdrawals', label: 'Total Withdrawals', isSelected: false },
    { name: 'total_tax_collected', label: 'Total Tax Collected', isSelected: false },
    { name: 'total_rewards_collected', label: 'Total Rewards Collected', isSelected: true },
    { name: 'total_transfers_in', label: 'Total Transfers In', isSelected: false },
    { name: 'transfers_in_count', label: 'Transfers In Count', isSelected: false },
    { name: 'total_transfers_out', label: 'Total Transfers Out', isSelected: false },
    { name: 'transfers_out_count', label: 'Transfers Out Count', isSelected: false },
    {
      name: 'total_rejected_transfers_claimed',
      label: 'Total Rejected Transfers Claimed',
      isSelected: false,
    },
    {
      name: 'rejected_transfers_claimed_count',
      label: 'Rejected Transfers Claimed Count',
      isSelected: false,
    },
    { name: 'total_transfers_rejected', label: 'Total Transfers Rejected', isSelected: false },
    { name: 'transfers_rejected_count', label: 'Transfers Rejected Count', isSelected: false },
    { name: 'total_volume', label: 'Total Volume', isSelected: true },
    {
      name: 'total_consensus_storage_fee',
      label: 'Total Consensus Storage Fee',
      isSelected: false,
    },
    { name: 'total_domain_execution_fee', label: 'Total Domain Execution Fee', isSelected: false },
    { name: 'total_burned_balance', label: 'Total Burned Balance', isSelected: false },
    { name: 'current_total_stake', label: 'Current Total Stake', isSelected: true },
    {
      name: 'current_storage_fee_deposit',
      label: 'Current Storage Fee Deposit',
      isSelected: false,
    },
    { name: 'current_total_shares', label: 'Current Total Shares', isSelected: false },
    { name: 'current_share_price', label: 'Current Share Price', isSelected: false },
    { name: 'accumulated_epoch_stake', label: 'Accumulated Epoch Stake', isSelected: false },
    {
      name: 'accumulated_epoch_storage_fee_deposit',
      label: 'Accumulated Epoch Storage Fee Deposit',
      isSelected: false,
    },
    { name: 'accumulated_epoch_rewards', label: 'Accumulated Epoch Rewards', isSelected: false },
    { name: 'accumulated_epoch_shares', label: 'Accumulated Epoch Shares', isSelected: false },
    { name: 'bundle_count', label: 'Bundle Count', isSelected: true },
    { name: 'current_epoch_duration', label: 'Current Epoch Duration', isSelected: false },
    { name: 'last_epoch_duration', label: 'Last Epoch Duration', isSelected: false },
    { name: 'last6_epochs_duration', label: 'Last 6 Epochs Duration', isSelected: false },
    { name: 'last144_epoch_duration', label: 'Last 144 Epoch Duration', isSelected: false },
    { name: 'last1k_epoch_duration', label: 'Last 1K Epoch Duration', isSelected: false },
    { name: 'last_bundle_at', label: 'Last Bundle At', isSelected: false },
    { name: 'created_at', label: 'Created At', isSelected: false },
    { name: 'updated_at', label: 'Updated At', isSelected: false },
  ],
  operators: [
    { name: 'id', label: 'Id', isSelected: true, searchable: true },
    { name: 'account_id', label: 'Owner', isSelected: true, searchable: true },
    { name: 'domain_id', label: 'Domain', isSelected: true, searchable: true },
    { name: 'signing_key', label: 'Signing Key', isSelected: true, searchable: true },
    { name: 'minimum_nominator_stake', label: 'Minimum Nominator Stake', isSelected: true },
    { name: 'nomination_tax', label: 'Nomination Tax', isSelected: true },
    // { name: 'name', label: 'Name', isSelected: true },
    // { name: 'description', label: 'Description', isSelected: false },
    // { name: 'icon', label: 'Icon', isSelected: false },
    // { name: 'banner', label: 'Banner', isSelected: false },
    // { name: 'website', label: 'Website', isSelected: false },
    // { name: 'website_verified', label: 'Website Verified', isSelected: false },
    // { name: 'email', label: 'Email', isSelected: false },
    // { name: 'email_verified', label: 'Email Verified', isSelected: false },
    // { name: 'discord', label: 'Discord', isSelected: false },
    // { name: 'github', label: 'Github', isSelected: false },
    // { name: 'twitter', label: 'Twitter', isSelected: false },
    { name: 'current_total_stake', label: 'Total Stake', isSelected: true },
    {
      name: 'current_storage_fee_deposit',
      label: 'Current Storage Fee Deposit',
      isSelected: false,
    },
    { name: 'current_epoch_rewards', label: 'Current Epoch Rewards', isSelected: false },
    { name: 'current_total_shares', label: 'Total Shares', isSelected: false },
    { name: 'current_share_price', label: 'Current Share Price', isSelected: false },
    { name: 'raw_status', label: 'Raw Status', isSelected: false },
    { name: 'total_deposits', label: 'Total Deposits', isSelected: false },
    {
      name: 'total_estimated_withdrawals',
      label: 'Total Estimated Withdrawals',
      isSelected: false,
    },
    { name: 'total_withdrawals', label: 'Total Withdrawals', isSelected: false },
    { name: 'total_tax_collected', label: 'Total Tax Collected', isSelected: false },
    { name: 'total_rewards_collected', label: 'Total Rewards Collected', isSelected: true },
    { name: 'total_transfers_in', label: 'Total Transfers In', isSelected: false },
    { name: 'transfers_in_count', label: 'Transfers In Count', isSelected: false },
    { name: 'total_transfers_out', label: 'Total Transfers Out', isSelected: false },
    { name: 'transfers_out_count', label: 'Transfers Out Count', isSelected: false },
    {
      name: 'total_rejected_transfers_claimed',
      label: 'Total Rejected Transfers Claimed',
      isSelected: false,
    },
    {
      name: 'rejected_transfers_claimed_count',
      label: 'Rejected Transfers Claimed Count',
      isSelected: false,
    },
    { name: 'total_transfers_rejected', label: 'Total Transfers Rejected', isSelected: false },
    { name: 'transfers_rejected_count', label: 'Transfers Rejected Count', isSelected: false },
    { name: 'total_volume', label: 'Total Volume', isSelected: false },
    {
      name: 'total_consensus_storage_fee',
      label: 'Total Consensus Storage Fee',
      isSelected: false,
    },
    { name: 'total_domain_execution_fee', label: 'Total Domain Execution Fee', isSelected: false },
    { name: 'total_burned_balance', label: 'Total Burned Balance', isSelected: false },
    { name: 'accumulated_epoch_stake', label: 'Accumulated Epoch Stake', isSelected: false },
    {
      name: 'accumulated_epoch_storage_fee_deposit',
      label: 'Accumulated Epoch Storage Fee Deposit',
      isSelected: false,
    },
    { name: 'accumulated_epoch_rewards', label: 'Accumulated Epoch Rewards', isSelected: false },
    { name: 'accumulated_epoch_shares', label: 'Accumulated Epoch Shares', isSelected: false },
    { name: 'active_epoch_count', label: 'Active Epoch Count', isSelected: false },
    { name: 'bundle_count', label: 'Bundle Count', isSelected: false },
    { name: 'status', label: 'Status', isSelected: true },
    { name: 'raw_status', label: 'Raw Status', isSelected: false },
    { name: 'pending_action', label: 'Pending Action', isSelected: false },
    { name: 'last_bundle_at', label: 'Last Bundle At', isSelected: false },
    { name: 'nominators_aggregate', label: 'Nominator Count', isSelected: false },
    { name: 'deposits_aggregate', label: 'Deposit Count', isSelected: false },
    { name: 'created_at', label: 'Created At', isSelected: false },
    { name: 'updated_at', label: 'Updated At', isSelected: false },
  ],
}

export const FILTERS_OPTIONS: FiltersOptions = {
  domains: [
    { type: 'range', label: 'Total Stake', key: 'totalStake' },
    { type: 'range', label: 'Total Deposits', key: 'totalDeposits' },
    { type: 'range', label: 'Total Rewards Collected', key: 'totalRewardsCollected' },
    { type: 'range', label: 'Deposit Count', key: 'depositsCount' },
    { type: 'range', label: 'Completed Epoch', key: 'completedEpoch' },
    { type: 'range', label: 'Bundle Count', key: 'bundleCount' },
  ],
  operators: [
    { type: 'range', label: 'Total Stake', key: 'totalStake' },
    { type: 'range', label: 'Nomination Tax', key: 'nominationTax' },
    { type: 'range', label: 'Minimum Nominator Stake', key: 'minimumNominatorStake' },
    { type: 'range', label: 'Total Rewards Collected', key: 'totalRewardsCollected' },
    { type: 'range', label: 'Nominator Count', key: 'nominatorsCount' },
    { type: 'range', label: 'Deposit Count', key: 'depositsCount' },
    {
      type: 'checkbox',
      label: 'Status',
      key: 'status',
      options: ['Registered', 'Deregistered', 'Slashed', 'Ready To Unlock'],
    },
    { type: 'range', label: 'Active Epoch Count', key: 'activeEpochCount' },
    { type: 'range', label: 'Bundle Count', key: 'bundleCount' },
  ],
}

const INITIAL_TABLE_PROPERTIES = {
  filters: {},
  pagination: {
    pageSize: PAGE_SIZE,
    pageIndex: 0,
  },
  showTableSettings: null,
}

export const INITIAL_TABLES: InitialTables = {
  domains: {
    ...INITIAL_TABLE_PROPERTIES,
    name: 'domains',
    columns: AVAILABLE_COLUMNS.domains,
    selectedColumns: AVAILABLE_COLUMNS.domains
      .filter((column) => column.isSelected)
      .map((column) => column.name),
    filtersOptions: FILTERS_OPTIONS.domains,
    filters: {
      totalStakeMin: '',
      totalStakeMax: '',
      totalDepositsMin: '',
      totalDepositsMax: '',
      totalRewardsCollectedMin: '',
      totalRewardsCollectedMax: '',
      depositsCountMin: '',
      depositsCountMax: '',
      completedEpochMin: '',
      completedEpochMax: '',
      bundleCountMin: '',
      bundleCountMax: '',
    },
    sorting: [
      {
        id: 'id',
        desc: false,
      },
    ],
  },
  operators: {
    ...INITIAL_TABLE_PROPERTIES,
    name: 'operators',
    columns: AVAILABLE_COLUMNS.operators,
    selectedColumns: AVAILABLE_COLUMNS.operators
      .filter((column) => column.isSelected)
      .map((column) => column.name),
    filtersOptions: FILTERS_OPTIONS.operators,
    filters: {
      totalStakeMin: '',
      totalStakeMax: '',
      nominationTaxMin: '',
      nominationTaxMax: '',
      minimumNominatorStakeMin: '',
      minimumNominatorStakeMax: '',
      totalRewardsCollectedMin: '',
      totalRewardsCollectedMax: '',
      nominatorsCountMin: '',
      nominatorsCountMax: '',
      statusRegistered: '',
      statusDeregistered: '',
      statusSlashed: '',
      activeEpochCountMin: '',
      activeEpochCountMax: '',
      bundleCountMin: '',
      bundleCountMax: '',
    },
    sorting: [
      {
        id: 'id',
        desc: false,
      },
    ],
  },
}
