import 'dotenv/config'
import { syncInstagramPosts } from '../lib/tcg/sync.js'

const run = async () => {
  const result = await syncInstagramPosts({ notify: true })
  console.log('TCG sync result:')
  console.log(JSON.stringify(result, null, 2))
  console.log(
    `Summary: fetched=${result.fetched} inserted=${result.inserted} notified=${result.notified} ` +
    `auth=${result.authStatus || 'unknown'} handles_ok=${result.successHandles || 0}/${result.totalHandles || 0}`,
  )
}

run().catch((error) => {
  console.error('TCG sync failed:')
  console.error(error instanceof Error ? error.stack : error)
  process.exit(1)
})
