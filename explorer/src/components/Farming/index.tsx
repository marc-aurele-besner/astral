'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'

interface ReleaseAsset {
  name: string
  browser_download_url: string
}

interface ReleaseData {
  assets: ReleaseAsset[]
}

export const DownloadPage: FC = () => {
  const [userOS, setUserOS] = useState<string | null>(null)
  const [releaseAssets, setReleaseAssets] = useState<ReleaseAsset[]>([])

  useEffect(() => {
    const getOS = () => {
      const userAgent = window.navigator.userAgent
      if (userAgent.indexOf('Win') !== -1) return 'Windows'
      if (userAgent.indexOf('Mac') !== -1) return 'macOS'
      if (userAgent.indexOf('Linux') !== -1) return 'Linux'
      return null
    }

    setUserOS(getOS())
  }, [])

  useEffect(() => {
    const fetchLatestRelease = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/repos/subspace/space-acres/releases/latest',
        )
        if (response.status === 200) {
          const data: ReleaseData = await response.json()
          setReleaseAssets(data.assets)
        }
      } catch (error) {
        console.error('Error fetching latest release:', error)
      }
    }

    fetchLatestRelease()
  }, [])

  const getDownloadLink = useCallback(
    (os: string) => {
      switch (os) {
        case 'Windows':
          return releaseAssets.find((asset) => asset.name.endsWith('.msi'))?.browser_download_url
        case 'macOS':
          return releaseAssets.find((asset) => asset.name.endsWith('.dmg'))?.browser_download_url
        case 'Linux':
          return releaseAssets.find((asset) => asset.name.endsWith('.deb'))?.browser_download_url
        default:
          return '#'
      }
    },
    [releaseAssets],
  )

  const getAssetName = useCallback(
    (os: string) => {
      switch (os) {
        case 'Windows':
          return releaseAssets.find((asset) => asset.name.endsWith('.msi'))?.name
        case 'macOS':
          return releaseAssets.find((asset) => asset.name.endsWith('.dmg'))?.name
        case 'Linux':
          return releaseAssets.find((asset) => asset.name.endsWith('.deb'))?.name
        default:
          return ''
      }
    },
    [releaseAssets],
  )

  const renderDownloadSection = useMemo(() => {
    const downloadLink = getDownloadLink(userOS || '')

    switch (userOS) {
      case 'Windows':
        return (
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>Download Space Acres for Windows</h2>
            <p>Minimum Requirements:</p>
            <ul className='list-inside list-disc'>
              <li>OS: Windows 10 or higher</li>
              <li>Processor: Intel Core i3 or equivalent</li>
              <li>RAM: 4 GB</li>
              <li>Disk Space: 500 MB</li>
            </ul>
            <a href={downloadLink} className='btn-download mt-4'>
              Download
              <div className='text-sm'>Windows</div>
            </a>
            <h3 className='mt-6 text-xl font-semibold'>Installation Instructions:</h3>
            <ol className='list-inside list-decimal text-left'>
              <li>Download the installer from the link above.</li>
              <li>Run the installer and follow the on-screen instructions.</li>
              <li>Once installed, open Space Acres from your Start menu.</li>
            </ol>
          </div>
        )
      case 'macOS':
        return (
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>Download Space Acres for macOS</h2>
            <p>Minimum Requirements:</p>
            <ul className='list-inside list-disc'>
              <li>OS: macOS 10.14 or higher</li>
              <li>Processor: Intel Core i3 or equivalent</li>
              <li>RAM: 4 GB</li>
              <li>Disk Space: 500 MB</li>
            </ul>
            <a href={downloadLink} className='btn-download mt-4'>
              Download
              <div className='text-sm'>macOS</div>
            </a>
            <h3 className='mt-6 text-xl font-semibold'>Installation Instructions:</h3>
            <ol className='list-inside list-decimal text-left'>
              <li>Download the DMG file from the link above.</li>
              <li>Open the DMG file and drag Space Acres to your Applications folder.</li>
              <li>Launch Space Acres from the Applications folder.</li>
            </ol>
          </div>
        )
      case 'Linux':
        return (
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>Download Space Acres for Linux</h2>
            <p>Minimum Requirements:</p>
            <ul className='list-inside list-disc'>
              <li>OS: Ubuntu 18.04 or higher</li>
              <li>Processor: Intel Core i3 or equivalent</li>
              <li>RAM: 4 GB</li>
              <li>Disk Space: 500 MB</li>
            </ul>
            <a href={downloadLink} className='btn-download mt-4'>
              Download
              <div className='text-sm'>Linux</div>
            </a>
            <h3 className='mt-6 text-xl font-semibold'>Installation Instructions:</h3>
            <ol className='list-inside list-decimal text-left'>
              <li>Download the tar.gz file from the link above.</li>
              <li>Extract the file to your desired location.</li>
              <li>Open a terminal and navigate to the extracted folder.</li>
              <li>Run `./install.sh` to install Space Acres.</li>
            </ol>
          </div>
        )
      default:
        return <p className='text-center'>Sorry, your operating system is not supported.</p>
    }
  }, [getDownloadLink, userOS])

  return (
    <div className='flex w-full flex-col items-center space-y-4'>
      <div className='w-full max-w-4xl'>
        <div className='mb-4 w-full rounded-[20px] border border-slate-100 bg-white px-3 py-4 shadow dark:border-none dark:bg-gradient-to-r dark:from-gradientTwilight dark:via-gradientDusk dark:to-gradientSunset sm:p-6'>
          <div className='mb-10 flex flex-col items-center justify-center'>
            <h1 className='mb-8 mt-6 text-center text-4xl font-bold text-gray-900 dark:text-white'>
              Put your unused disk space to work and contribute to the Network
            </h1>
            {renderDownloadSection && (
              <div className='mb-2 flex items-center justify-center text-center'>
                <a href={getDownloadLink(userOS || '')} className='row btn-download'>
                  <button className='relative mb-2 w-full cursor-default rounded-full bg-purpleAccent from-pinkAccent to-purpleDeepAccent py-[10px] pl-3 pr-16 text-left font-["Montserrat"] text-white shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:bg-gradient-to-r dark:text-white sm:text-sm md:pr-10'>
                    Download Space Acres
                  </button>
                  <div className='text-sm text-gray-900 dark:text-white'>
                    {getAssetName(userOS || '')} for {userOS}
                  </div>
                </a>
              </div>
            )}
          </div>
          <div className='m-6 flow-root'>
            <Image
              alt='Space Acres Screenshot Installation'
              width={800}
              height={400}
              src='https://docs.subspace.network/assets/images/space-acres-setup-7-3490cba2e75635efdea0006d06da9936.png'
              className='mx-auto'
            />
          </div>
        </div>

        <div className='m-4 p-4'>
          <h3 className='mb-8 mt-6 text-center text-4xl font-bold text-gray-900 dark:text-white'>
            By contributing storage and compute to the network, you play a crucial role in securing
            it, while also earning rewards.
          </h3>
          <h3 className='mb-8 mt-6 text-center text-4xl font-bold text-gray-900 dark:text-white'>
            Your work is recognized and compensated based on your active participation, not through
            passive handouts. This approach ensures a self-sustaining and equitable ecosystem.
          </h3>
        </div>

        <div className='mb-4 w-full rounded-[20px] border border-slate-100 bg-white px-3 py-4 shadow dark:border-none dark:bg-gradient-to-r dark:from-gradientTwilight dark:via-gradientDusk dark:to-gradientSunset sm:p-6'>
          <div className='flow-root  text-gray-900 dark:text-white '>
            <div className='mx-auto w-3/4'>{renderDownloadSection}</div>
            <div className='support-section mt-12 items-center justify-center text-center'>
              <h3>Support and Documentation</h3>
              <p>
                For more detailed instructions, troubleshooting, and advanced usage, please refer to
                the{' '}
                <a
                  href='https://docs.subspace.network/docs/farming-&-staking/farming/space-acres/space-acres-install'
                  className='text-blue-500 underline'
                >
                  Space Acres documentation
                </a>
                .
              </p>
              <p>
                Need help? Visit our{' '}
                <a
                  href='https://docs.subspace.network/docs/category/farming'
                  className='text-blue-500 underline'
                >
                  support page
                </a>{' '}
                or contact us at support@subspace.network.
              </p>
              <p>
                Stay up to date with the latest news and updates by subscribing to our{' '}
                <Link href='#' className='text-blue-500 underline'>
                  newsletter
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DownloadPage
