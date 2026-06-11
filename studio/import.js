import { createReadStream } from 'fs'
import { basename, join } from 'path'
import { getCliClient } from 'sanity/cli'
import fs from 'fs'

const client = getCliClient()

async function importData() {
  const dataPath = join('..', 'data', 'projects.json')
  const fileContent = fs.readFileSync(dataPath, 'utf8')
  const projectsData = JSON.parse(fileContent)

  for (const project of projectsData.items) {
    console.log(`Importing: ${project.title}...`)
    
    const filePath = join('..', project.mediaSrc)
    
    try {
      const asset = await client.assets.upload('file', createReadStream(filePath), {
        filename: basename(filePath)
      })
      
      await client.create({
        _type: 'project',
        title: project.title,
        category: project.category,
        categoryLabel: project.categoryLabel,
        mediaType: project.mediaType,
        media: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: asset._id
          }
        }
      })
      
      console.log(`Done: ${project.title}`)
    } catch (err) {
      console.error(`Failed to import ${project.title}:`, err.message)
    }
  }
  console.log('All projects imported successfully!')
}

importData().catch(console.error)
