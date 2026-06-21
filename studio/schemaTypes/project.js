export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Filter Category',
      type: 'string',
      options: {
        list: [
          { title: 'Interiors', value: 'interiors' },
          { title: 'Modular Kitchens', value: 'kitchens' },
          { title: 'Landscape', value: 'landscape' },
          { title: 'Furniture (Wardrobes)', value: 'furniture' },
          { title: 'Exterior', value: 'exterior' },
          { title: 'Commercial Spaces', value: 'commercial' },
          { title: 'Businesses', value: 'businesses' },
          { title: 'Renovations', value: 'renovations' },
          { title: 'Ceiling & Lights', value: 'ceiling' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'categoryLabel',
      title: 'Category Display Label',
      description: 'What should be displayed on the image? (e.g., Modular Kitchens)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'video',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'media',
      title: 'Media File (Image or Video)',
      type: 'file',
      options: {
        accept: 'image/*,video/*',
      },
      validation: (Rule) => Rule.required(),
    },
  ],
}
