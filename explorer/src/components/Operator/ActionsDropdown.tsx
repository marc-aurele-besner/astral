'use client'

import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { FC, Fragment, useMemo } from 'react'
import { OperatorAction, OperatorActionType } from './ActionsModal'

export type ActionsDropdownRow = {
  original: {
    id: string
    currentTotalStake: string
  }
}

interface ActionsDropdownProps {
  action: OperatorAction
  handleAction: (action: OperatorAction) => void
  row: ActionsDropdownRow
  excludeActions?: OperatorActionType[]
  nominatorMaxStake?: string
}

export const ActionsDropdown: FC<ActionsDropdownProps> = ({
  action,
  handleAction,
  row,
  excludeActions,
  nominatorMaxStake,
}) => {
  const actionsAvailable = useMemo(
    () =>
      Object.keys(OperatorActionType)
        .slice(1)
        .filter(
          (type) =>
            !excludeActions ||
            !excludeActions.includes(OperatorActionType[type as keyof typeof OperatorActionType]),
        ),
    [excludeActions],
  )

  return (
    <Listbox
      value={action.type}
      onChange={(val) =>
        handleAction({
          type: val,
          operatorId: parseInt(row.original.id),
          maxAmount: nominatorMaxStake
            ? BigInt(nominatorMaxStake)
            : BigInt(row.original.currentTotalStake),
        })
      }
    >
      <div className='relative'>
        <Listbox.Button className='relative w-full cursor-default rounded-full bg-[#DE67E4] from-[#EA71F9] to-[#4D397A] py-[10px] pl-3 pr-16 text-left font-["Montserrat"] text-white shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:bg-gradient-to-r dark:text-white sm:text-sm md:pr-10'>
          <div className='flex items-center justify-center'>
            <span className='ml-2 w-5 text-sm md:w-full '>Actions</span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <ChevronDownIcon
                className='size-5 text-gray-400 ui-open:rotate-180 dark:text-[#DE67E4]'
                aria-hidden='true'
              />
            </span>
          </div>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Listbox.Options className='absolute z-40 mt-1 max-h-60 w-auto overflow-auto rounded-xl bg-white py-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-[#1E254E] dark:text-white sm:text-sm md:w-full'>
            {actionsAvailable.map((actionType, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pr-4 text-gray-900 dark:text-white md:pl-4 ${
                    active && 'bg-gray-100 dark:bg-[#2A345E]'
                  }`
                }
                value={actionType}
              >
                {({ selected }) => (
                  <span
                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'} ${
                      OperatorActionType[actionType as keyof typeof OperatorActionType] ===
                        OperatorActionType.Deregister && 'text-red-500'
                    }`}
                  >
                    {OperatorActionType[actionType as keyof typeof OperatorActionType]}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
