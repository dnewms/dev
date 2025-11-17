import { create } from 'zustand'

export type BlockType = 'header' | 'text' | 'image' | 'button' | 'divider' | 'event' | 'research' | 'achievement'

export interface ContentBlock {
  id: string
  type: BlockType
  content: {
    title?: string
    text?: string
    imageUrl?: string
    buttonText?: string
    buttonUrl?: string
    date?: string
    location?: string
    researcher?: string
    student?: string
    alignment?: 'left' | 'center' | 'right'
  }
}

export interface Newsletter {
  id: string
  title: string
  subject: string
  blocks: ContentBlock[]
  createdAt: string
  updatedAt: string
  status: 'draft' | 'sent'
  sentAt?: string
  analytics?: {
    sent: number
    opened: number
    clicked: number
  }
}

export interface Contact {
  id: string
  email: string
  firstName: string
  lastName: string
  tags: string[]
  subscribedAt: string
}

interface NewsletterStore {
  newsletters: Newsletter[]
  currentNewsletter: Newsletter | null
  contacts: Contact[]

  // Newsletter actions
  createNewsletter: () => void
  updateNewsletter: (newsletter: Newsletter) => void
  deleteNewsletter: (id: string) => void
  setCurrentNewsletter: (newsletter: Newsletter | null) => void

  // Block actions
  addBlock: (block: ContentBlock) => void
  updateBlock: (id: string, content: Partial<ContentBlock['content']>) => void
  deleteBlock: (id: string) => void
  reorderBlocks: (startIndex: number, endIndex: number) => void

  // Contact actions
  addContact: (contact: Contact) => void
  updateContact: (id: string, contact: Partial<Contact>) => void
  deleteContact: (id: string) => void
  importContacts: (contacts: Contact[]) => void
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useNewsletterStore = create<NewsletterStore>((set) => ({
  newsletters: [],
  currentNewsletter: null,
  contacts: [],

  createNewsletter: () => {
    const newsletter: Newsletter = {
      id: generateId(),
      title: 'Untitled Newsletter',
      subject: '',
      blocks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
    }
    set((state) => ({
      newsletters: [...state.newsletters, newsletter],
      currentNewsletter: newsletter,
    }))
  },

  updateNewsletter: (newsletter) => {
    set((state) => ({
      newsletters: state.newsletters.map((n) =>
        n.id === newsletter.id ? { ...newsletter, updatedAt: new Date().toISOString() } : n
      ),
      currentNewsletter: state.currentNewsletter?.id === newsletter.id
        ? { ...newsletter, updatedAt: new Date().toISOString() }
        : state.currentNewsletter,
    }))
  },

  deleteNewsletter: (id) => {
    set((state) => ({
      newsletters: state.newsletters.filter((n) => n.id !== id),
      currentNewsletter: state.currentNewsletter?.id === id ? null : state.currentNewsletter,
    }))
  },

  setCurrentNewsletter: (newsletter) => {
    set({ currentNewsletter: newsletter })
  },

  addBlock: (block) => {
    set((state) => {
      if (!state.currentNewsletter) return state
      return {
        currentNewsletter: {
          ...state.currentNewsletter,
          blocks: [...state.currentNewsletter.blocks, block],
          updatedAt: new Date().toISOString(),
        },
      }
    })
  },

  updateBlock: (id, content) => {
    set((state) => {
      if (!state.currentNewsletter) return state
      return {
        currentNewsletter: {
          ...state.currentNewsletter,
          blocks: state.currentNewsletter.blocks.map((block) =>
            block.id === id ? { ...block, content: { ...block.content, ...content } } : block
          ),
          updatedAt: new Date().toISOString(),
        },
      }
    })
  },

  deleteBlock: (id) => {
    set((state) => {
      if (!state.currentNewsletter) return state
      return {
        currentNewsletter: {
          ...state.currentNewsletter,
          blocks: state.currentNewsletter.blocks.filter((block) => block.id !== id),
          updatedAt: new Date().toISOString(),
        },
      }
    })
  },

  reorderBlocks: (startIndex, endIndex) => {
    set((state) => {
      if (!state.currentNewsletter) return state
      const blocks = Array.from(state.currentNewsletter.blocks)
      const [removed] = blocks.splice(startIndex, 1)
      blocks.splice(endIndex, 0, removed)
      return {
        currentNewsletter: {
          ...state.currentNewsletter,
          blocks,
          updatedAt: new Date().toISOString(),
        },
      }
    })
  },

  addContact: (contact) => {
    set((state) => ({
      contacts: [...state.contacts, contact],
    }))
  },

  updateContact: (id, contactUpdate) => {
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === id ? { ...contact, ...contactUpdate } : contact
      ),
    }))
  },

  deleteContact: (id) => {
    set((state) => ({
      contacts: state.contacts.filter((contact) => contact.id !== id),
    }))
  },

  importContacts: (contacts) => {
    set((state) => ({
      contacts: [...state.contacts, ...contacts],
    }))
  },
}))
