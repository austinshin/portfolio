import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Example function to store contact form submissions
export const submitContactForm = async (data: {
  name: string
  email: string
  subject: string
  message: string
}) => {
  const { data: result, error } = await supabase
    .from('contact_submissions')
    .insert([data])

  if (error) {
    console.error('Error submitting form:', error)
    return { success: false, error }
  }

  return { success: true, data: result }
}

// Example function to fetch portfolio projects from Supabase
export const getPortfolioProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

// Example function to track page views
export const trackPageView = async (page: string) => {
  const { error } = await supabase
    .from('analytics')
    .insert([{ page, timestamp: new Date().toISOString() }])

  if (error) {
    console.error('Error tracking page view:', error)
  }
}
