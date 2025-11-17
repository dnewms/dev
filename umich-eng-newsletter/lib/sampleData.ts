import { Newsletter, Contact } from './store'

/**
 * Sample data for testing and demonstration purposes
 * This file contains pre-populated newsletters and contacts
 * to help users see the app in action
 */

export const sampleNewsletters: Newsletter[] = [
  {
    id: 'sample-1',
    title: 'March 2024 Engineering Newsletter',
    subject: 'U-M Engineering: Research Breakthroughs & Student Success',
    status: 'sent',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
    sentAt: '2024-03-01T14:00:00Z',
    analytics: {
      sent: 1250,
      opened: 325,
      clicked: 78,
    },
    blocks: [
      {
        id: 'b1',
        type: 'header',
        content: {
          title: 'Engineering Excellence',
          alignment: 'center',
        },
      },
      {
        id: 'b2',
        type: 'text',
        content: {
          text: 'Welcome to the March 2024 edition of the U-M Engineering newsletter. This month, we celebrate groundbreaking research, outstanding student achievements, and upcoming events.',
          alignment: 'left',
        },
      },
      {
        id: 'b3',
        type: 'research',
        content: {
          title: 'Breakthrough in Quantum Computing',
          researcher: 'Dr. Sarah Chen, Electrical Engineering',
          text: 'Professor Chen and her team have developed a new quantum error correction method that could accelerate the development of practical quantum computers by years.',
        },
      },
      {
        id: 'b4',
        type: 'achievement',
        content: {
          title: 'NSF Graduate Research Fellowship',
          student: 'Alex Martinez, PhD Candidate',
          text: 'Alex has been awarded the prestigious NSF Graduate Research Fellowship for groundbreaking work in renewable energy storage systems.',
        },
      },
      {
        id: 'b5',
        type: 'event',
        content: {
          title: 'Engineering Career Fair',
          date: '2024-04-15',
          location: 'Chrysler Center',
          text: 'Join us for our annual career fair featuring over 100 top employers from tech, automotive, aerospace, and more.',
        },
      },
    ],
  },
  {
    id: 'sample-2',
    title: 'Research Spotlight: AI & Robotics',
    subject: 'Discover the Future of AI at U-M Engineering',
    status: 'sent',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
    sentAt: '2024-02-15T14:00:00Z',
    analytics: {
      sent: 1180,
      opened: 295,
      clicked: 89,
    },
    blocks: [
      {
        id: 'b1',
        type: 'header',
        content: {
          title: 'AI & Robotics Research',
          alignment: 'center',
        },
      },
      {
        id: 'b2',
        type: 'research',
        content: {
          title: 'Autonomous Vehicle Perception Systems',
          researcher: 'Dr. James Wilson, Mechanical Engineering',
          text: 'New computer vision algorithms improve autonomous vehicle safety in challenging weather conditions by 40%.',
        },
      },
      {
        id: 'b3',
        type: 'research',
        content: {
          title: 'Medical Robotics for Minimally Invasive Surgery',
          researcher: 'Dr. Emily Thompson, Biomedical Engineering',
          text: 'Innovative robotic system enables surgeons to perform complex procedures with unprecedented precision.',
        },
      },
    ],
  },
  {
    id: 'sample-3',
    title: 'April Events Calendar',
    subject: 'Join Us for Exciting Events This April',
    status: 'draft',
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-22T15:30:00Z',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        content: {
          title: 'Upcoming Events',
          alignment: 'center',
        },
      },
      {
        id: 'b2',
        type: 'event',
        content: {
          title: 'Distinguished Lecture: Climate Tech',
          date: '2024-04-05',
          location: 'Dow Building Auditorium',
          text: 'Join renowned climate scientist Dr. Maria Garcia as she discusses cutting-edge technologies to combat climate change.',
        },
      },
      {
        id: 'b3',
        type: 'event',
        content: {
          title: 'Student Research Symposium',
          date: '2024-04-12',
          location: 'Beyster Building',
          text: 'Undergraduate and graduate students present their latest research findings. Poster session followed by networking reception.',
        },
      },
      {
        id: 'b4',
        type: 'event',
        content: {
          title: 'Alumni Networking Night',
          date: '2024-04-20',
          location: 'Michigan Union',
          text: 'Connect with fellow U-M Engineering alumni and current students. Hear updates about exciting developments in the college.',
        },
      },
    ],
  },
]

export const sampleContacts: Contact[] = [
  {
    id: 'c1',
    email: 'john.smith@umich.edu',
    firstName: 'John',
    lastName: 'Smith',
    tags: ['faculty', 'mechanical'],
    subscribedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'c2',
    email: 'sarah.johnson@umich.edu',
    firstName: 'Sarah',
    lastName: 'Johnson',
    tags: ['student', 'electrical'],
    subscribedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: 'c3',
    email: 'michael.chen@umich.edu',
    firstName: 'Michael',
    lastName: 'Chen',
    tags: ['alumni', 'computer-science'],
    subscribedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: 'c4',
    email: 'emily.davis@umich.edu',
    firstName: 'Emily',
    lastName: 'Davis',
    tags: ['faculty', 'biomedical'],
    subscribedAt: '2024-01-18T10:00:00Z',
  },
  {
    id: 'c5',
    email: 'david.wilson@umich.edu',
    firstName: 'David',
    lastName: 'Wilson',
    tags: ['student', 'aerospace'],
    subscribedAt: '2024-01-19T10:00:00Z',
  },
  {
    id: 'c6',
    email: 'jessica.martinez@umich.edu',
    firstName: 'Jessica',
    lastName: 'Martinez',
    tags: ['staff', 'administration'],
    subscribedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'c7',
    email: 'robert.taylor@umich.edu',
    firstName: 'Robert',
    lastName: 'Taylor',
    tags: ['alumni', 'mechanical'],
    subscribedAt: '2024-01-21T10:00:00Z',
  },
  {
    id: 'c8',
    email: 'amanda.anderson@umich.edu',
    firstName: 'Amanda',
    lastName: 'Anderson',
    tags: ['student', 'civil'],
    subscribedAt: '2024-01-22T10:00:00Z',
  },
  {
    id: 'c9',
    email: 'christopher.thomas@umich.edu',
    firstName: 'Christopher',
    lastName: 'Thomas',
    tags: ['faculty', 'materials-science'],
    subscribedAt: '2024-01-23T10:00:00Z',
  },
  {
    id: 'c10',
    email: 'jennifer.jackson@umich.edu',
    firstName: 'Jennifer',
    lastName: 'Jackson',
    tags: ['student', 'chemical'],
    subscribedAt: '2024-01-24T10:00:00Z',
  },
  {
    id: 'c11',
    email: 'matthew.white@umich.edu',
    firstName: 'Matthew',
    lastName: 'White',
    tags: ['alumni', 'electrical'],
    subscribedAt: '2024-01-25T10:00:00Z',
  },
  {
    id: 'c12',
    email: 'lisa.harris@umich.edu',
    firstName: 'Lisa',
    lastName: 'Harris',
    tags: ['faculty', 'industrial'],
    subscribedAt: '2024-01-26T10:00:00Z',
  },
  {
    id: 'c13',
    email: 'daniel.martin@umich.edu',
    firstName: 'Daniel',
    lastName: 'Martin',
    tags: ['student', 'computer-science'],
    subscribedAt: '2024-01-27T10:00:00Z',
  },
  {
    id: 'c14',
    email: 'nancy.garcia@umich.edu',
    firstName: 'Nancy',
    lastName: 'Garcia',
    tags: ['staff', 'research'],
    subscribedAt: '2024-01-28T10:00:00Z',
  },
  {
    id: 'c15',
    email: 'kevin.rodriguez@umich.edu',
    firstName: 'Kevin',
    lastName: 'Rodriguez',
    tags: ['alumni', 'aerospace'],
    subscribedAt: '2024-01-29T10:00:00Z',
  },
]

/**
 * Load sample data into the application
 * Call this function to populate the app with demo data
 */
export function loadSampleData() {
  if (typeof window === 'undefined') return

  try {
    // Load sample newsletters
    const existingNewsletters = localStorage.getItem('newsletters')
    if (!existingNewsletters) {
      localStorage.setItem('newsletters', JSON.stringify(sampleNewsletters))
      console.log('✅ Sample newsletters loaded')
    }

    // Load sample contacts
    const existingContacts = localStorage.getItem('contacts')
    if (!existingContacts) {
      localStorage.setItem('contacts', JSON.stringify(sampleContacts))
      console.log('✅ Sample contacts loaded')
    }

    return {
      newsletters: sampleNewsletters,
      contacts: sampleContacts,
    }
  } catch (error) {
    console.error('Error loading sample data:', error)
  }
}

/**
 * Clear all sample data
 */
export function clearSampleData() {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem('newsletters')
    localStorage.removeItem('contacts')
    console.log('🗑️  Sample data cleared')
  } catch (error) {
    console.error('Error clearing sample data:', error)
  }
}
