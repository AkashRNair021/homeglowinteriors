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
          { title: 'Living Rooms', value: 'living-rooms' },
          { title: 'Bedrooms', value: 'bedrooms' },
          { title: 'Modular Kitchens', value: 'kitchens' },
          { title: 'Bathrooms', value: 'bathrooms' },
          { title: 'Landscaping & Outdoor', value: 'outdoor' },
          { title: 'Renovations', value: 'renovations' },
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
