import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function migrate() {
  const query = '*[_type == "project" && category in ["living-rooms", "bedrooms", "bathrooms"]]'
  const projects = await client.fetch(query)

  if (projects.length === 0) {
    console.log('No projects to migrate.')
    return
  }

  const transaction = client.transaction()

  projects.forEach((doc) => {
    transaction.patch(doc._id, (p) => p.set({ category: 'interior', categoryLabel: 'Interior' }))
  })

  try {
    await transaction.commit()
    console.log(`Successfully migrated ${projects.length} projects!`)
  } catch (err) {
    console.error('Migration failed:', err.message)
  }
}

migrate().catch(console.error)
