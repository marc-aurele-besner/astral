import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { FC, ReactElement } from 'react'

// common
import { Tabs } from './Tabs'

dayjs.extend(relativeTime)

type Props = {
  children: ReactElement[] | ReactElement
  isDesktop?: boolean
}

export const PageTabs: FC<Props> = ({ children, isDesktop = false }) => {
  return (
    <Tabs
      tabStyle={
        isDesktop
          ? 'bg-white border border-slate-100 shadow rounded-lg p-4 dark:bg-gradient-to-r dark:from-gradientFrom dark:via-gradientVia dark:to-gradientTo dark:border-none'
          : ''
      }
      tabTitleStyle={!isDesktop ? 'bg-white rounded-[20px] mb-5 px-5 dark:bg-blueAccent' : ''}
      pillStyle={`dark:text-white ${isDesktop && 'dark:bg-transparent'}`}
      activePillStyle={`dark:text-white text-white bg-grayDarker ${
        isDesktop ? 'dark:bg-blueAccent' : 'dark:bg-primaryAccent'
      }`}
    >
      {children}
    </Tabs>
  )
}
