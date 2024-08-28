import { defaultIndexer, indexers } from 'constants/indexers'
import { cookies } from 'next/headers'

export const queryGraphqlServer = async (query: string, variables: object) => {
  try {
    // Get the selected chain from the cookies
    const { get } = cookies()
    console.log('all-cookies', cookies())
    const callbackUrlCookie =
      get('next-auth.callback-url') || get('__Secure-next-auth.callback-url')
    if (!callbackUrlCookie) throw new Error('No callback URL cookie')

    // Extract the network ID from the callback URL
    const callbackUrl = decodeURIComponent(callbackUrlCookie.value)
    const url = new URL(callbackUrl)
    console.log('url', url)
    let networkId = url.pathname.split('/')[1]
    console.log('networkId', networkId)
    if (!networkId) {
      networkId = defaultIndexer.network
    }
    console.log('networkId', networkId)

    // Find the selected chain api
    const api = indexers.find((indexer) => indexer.network === networkId)
    if (!api) throw new Error('No selected chain api')

    // Fetch the data from the api
    const request = await fetch(api.squids.old, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
    if (!request.ok) throw new Error(`API request failed with status ${request.status}`)
    const { data } = await request.json()

    // Return the data
    return data
  } catch (error) {
    console.error('Failed to fetch Astral Subsquid:', error)
    throw new Error('Failed to fetch Astral Subsquid')
  }
}
