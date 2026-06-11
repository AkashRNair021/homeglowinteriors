import { createReadStream } from 'fs'
import { basename, join } from 'path'
import { getCliClient } from 'sanity/cli'
import fs from 'fs'

const client = getCliClient()

async function importData() {
  const dataPath = join('..', 'data', 'transformations.json')
  const fileContent = fs.readFileSync(dataPath, 'utf8')
  const transformationsData = JSON.parse(fileContent)

  for (const item of transformationsData.items) {
    console.log(`Importing transformation: ${item.title}...`)
    
    const beforePath = join('..', item.beforeImageSrc)
    const afterPath = join('..', item.afterImageSrc)
    
    try {
      const beforeAsset = await client.assets.upload('image', createReadStream(beforePath), {
        filename: basename(beforePath)
      })
      const afterAsset = await client.assets.upload('image', createReadStream(afterPath), {
        filename: basename(afterPath)
      })
      
      await client.create({
        _type: 'transformation',
        title: item.title,
        description: item.description,
        beforeImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: beforeAsset._id
          }
        },
        afterImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: afterAsset._id
          }
        }
      })
      
      console.log(`Done: ${item.title}`)
    } catch (err) {
      console.error(`Failed to import ${item.title}:`, err.message)
    }
  }
  console.log('All transformations imported successfully!')
}

importData().catch(console.error)
