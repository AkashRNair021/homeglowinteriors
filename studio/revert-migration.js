import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function revertMigration() {
  const query = '*[_type == "project" && category == "interior"]'
  const projects = await client.fetch(query)

  if (projects.length === 0) {
    console.log('No interior projects found to revert.')
    return
  }

  const transaction = client.transaction()

  projects.forEach((doc) => {
    let newCategory = 'living-rooms';
    let newLabel = 'Living Rooms';
    
    const titleLower = doc.title.toLowerCase();
    
    if (titleLower.includes('bed') || titleLower.includes('master')) {
      newCategory = 'bedrooms';
      newLabel = 'Bedrooms';
    } else if (titleLower.includes('bath') || titleLower.includes('wash')) {
      newCategory = 'bathrooms';
      newLabel = 'Bathroom Settings';
    } else if (titleLower.includes('kitchen')) {
      // Just in case kitchen was accidentally included
      newCategory = 'kitchens';
      newLabel = 'Modular Kitchens';
    } else {
      // living room default
      newCategory = 'living-rooms';
      newLabel = 'Living Rooms';
    }

    console.log(`Reverting ${doc.title} -> ${newCategory}`);
    transaction.patch(doc._id, (p) => p.set({ category: newCategory, categoryLabel: newLabel }))
  })

  try {
    await transaction.commit()
    console.log(`Successfully reverted ${projects.length} projects!`)
  } catch (err) {
    console.error('Revert failed:', err.message)
  }
}

revertMigration().catch(console.error)
