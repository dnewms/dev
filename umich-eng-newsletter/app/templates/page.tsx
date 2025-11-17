'use client'

import { useRouter } from 'next/navigation'
import { useNewsletterStore, Newsletter, ContentBlock } from '@/lib/store'
import { FlaskConical, Award, Calendar, FileText } from 'lucide-react'

const templates: Array<{
  id: string
  name: string
  description: string
  icon: any
  category: string
  blocks: ContentBlock[]
}> = [
  {
    id: 'research-highlight',
    name: 'Research Highlight',
    description: 'Showcase groundbreaking research from U-M Engineering faculty and students',
    icon: FlaskConical,
    category: 'Research',
    blocks: [
      {
        id: '1',
        type: 'header',
        content: { title: 'Research Spotlight', alignment: 'center' },
      },
      {
        id: '2',
        type: 'research',
        content: {
          title: 'Breakthrough in Renewable Energy Storage',
          researcher: 'Dr. Jane Smith, Materials Science',
          text: 'Our team has developed a novel battery technology that increases energy density by 40% while reducing costs. This breakthrough could revolutionize electric vehicle technology and grid-scale energy storage.',
        },
      },
      {
        id: '3',
        type: 'image',
        content: { imageUrl: 'https://placehold.co/600x400/00274C/FFCB05?text=Research+Image' },
      },
      {
        id: '4',
        type: 'button',
        content: { buttonText: 'Read Full Article', buttonUrl: '#', alignment: 'center' },
      },
    ],
  },
  {
    id: 'student-achievement',
    name: 'Student Achievement',
    description: 'Celebrate outstanding student accomplishments and awards',
    icon: Award,
    category: 'Students',
    blocks: [
      {
        id: '1',
        type: 'header',
        content: { title: 'Student Excellence', alignment: 'center' },
      },
      {
        id: '2',
        type: 'achievement',
        content: {
          title: 'National Science Foundation Fellowship',
          student: 'Alex Johnson, PhD Candidate',
          text: 'Alex has been awarded the prestigious NSF Graduate Research Fellowship for work in artificial intelligence and robotics. The fellowship recognizes outstanding graduate students in NSF-supported fields.',
        },
      },
      {
        id: '3',
        type: 'achievement',
        content: {
          title: 'Best Paper Award at International Conference',
          student: 'Maria Garcia, Senior',
          text: 'Maria received the best paper award at the International Conference on Computer Vision for research on autonomous vehicle perception systems.',
        },
      },
      {
        id: '4',
        type: 'divider',
        content: {},
      },
      {
        id: '5',
        type: 'text',
        content: { text: 'Congratulations to all our award recipients! Your achievements make the entire U-M Engineering community proud.', alignment: 'center' },
      },
    ],
  },
  {
    id: 'upcoming-events',
    name: 'Upcoming Events',
    description: 'Share information about lectures, seminars, and department events',
    icon: Calendar,
    category: 'Events',
    blocks: [
      {
        id: '1',
        type: 'header',
        content: { title: 'Upcoming Events', alignment: 'center' },
      },
      {
        id: '2',
        type: 'text',
        content: { text: 'Join us for these exciting events happening this month at U-M Engineering:', alignment: 'left' },
      },
      {
        id: '3',
        type: 'event',
        content: {
          title: 'Distinguished Lecture Series: AI and Society',
          date: '2024-02-15',
          location: 'Dow Building Auditorium',
          text: 'Join renowned AI researcher Dr. Sarah Chen as she discusses the societal implications of artificial intelligence and machine learning technologies.',
        },
      },
      {
        id: '4',
        type: 'event',
        content: {
          title: 'Engineering Career Fair',
          date: '2024-02-20',
          location: 'Chrysler Center',
          text: 'Meet with top employers from around the country. Bring your resume and business attire. Open to all engineering students and recent alumni.',
        },
      },
      {
        id: '5',
        type: 'event',
        content: {
          title: 'Student Research Symposium',
          date: '2024-02-25',
          location: 'Beyster Building',
          text: 'Undergraduate and graduate students will present their latest research findings. Poster session followed by networking reception.',
        },
      },
    ],
  },
  {
    id: 'general-newsletter',
    name: 'General Newsletter',
    description: 'A versatile template for mixed content announcements',
    icon: FileText,
    category: 'General',
    blocks: [
      {
        id: '1',
        type: 'header',
        content: { title: 'U-M Engineering Newsletter', alignment: 'center' },
      },
      {
        id: '2',
        type: 'text',
        content: { text: 'Welcome to this month\'s newsletter! Here\'s what\'s happening in the College of Engineering.', alignment: 'left' },
      },
      {
        id: '3',
        type: 'divider',
        content: {},
      },
      {
        id: '4',
        type: 'header',
        content: { title: 'News & Announcements', alignment: 'left' },
      },
      {
        id: '5',
        type: 'text',
        content: { text: 'Add your latest news and announcements here.', alignment: 'left' },
      },
      {
        id: '6',
        type: 'divider',
        content: {},
      },
      {
        id: '7',
        type: 'header',
        content: { title: 'Get Involved', alignment: 'left' },
      },
      {
        id: '8',
        type: 'button',
        content: { buttonText: 'Visit Our Website', buttonUrl: 'https://engineering.umich.edu', alignment: 'center' },
      },
    ],
  },
]

export default function TemplatesPage() {
  const router = useRouter()
  const { createNewsletter, setCurrentNewsletter, updateNewsletter } = useNewsletterStore()

  const handleUseTemplate = (template: typeof templates[0]) => {
    // Create a new newsletter from template
    const newsletter: Newsletter = {
      id: Math.random().toString(36).substr(2, 9),
      title: template.name,
      subject: `U-M Engineering: ${template.name}`,
      blocks: template.blocks.map(block => ({
        ...block,
        id: Math.random().toString(36).substr(2, 9),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
    }

    // Add to store
    useNewsletterStore.setState(state => ({
      newsletters: [...state.newsletters, newsletter],
      currentNewsletter: newsletter,
    }))

    // Navigate to builder
    router.push('/builder')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-michigan-blue mb-2">Email Templates</h1>
        <p className="text-gray-600">Choose a pre-built template to get started quickly</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {templates.map((template) => {
          const Icon = template.icon
          return (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-michigan-blue text-white p-3 rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-michigan-blue mb-1">
                      {template.name}
                    </h3>
                    <span className="inline-block px-2 py-1 bg-michigan-wave-blue/20 text-michigan-blue text-xs rounded-full">
                      {template.category}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Includes:</div>
                  <div className="flex flex-wrap gap-2">
                    {template.blocks.map((block, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {block.type}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="w-full bg-michigan-maize text-michigan-blue px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Use This Template
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-michigan-blue mb-2">Need a Custom Template?</h2>
        <p className="text-gray-700 mb-4">
          Start from scratch with the newsletter builder and create your own custom template.
          You can mix and match different content blocks to create the perfect newsletter for your needs.
        </p>
        <button
          onClick={() => {
            createNewsletter()
            router.push('/builder')
          }}
          className="bg-michigan-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-michigan-arboretum-blue transition-colors"
        >
          Start from Scratch
        </button>
      </div>
    </div>
  )
}
