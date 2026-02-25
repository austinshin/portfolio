import 'dotenv/config'
import { syncInstagramPosts } from '../lib/tcg/sync.js'

const run = async () => {
  const result = await syncInstagramPosts({ notify: true })
  console.log(JSON.stringify(result, null, 2))
}

run().catch((error) => {
  console.error('TCG sync failed:')
  console.error(error instanceof Error ? error.stack : error)
  process.exit(1)
})
