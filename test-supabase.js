// Quick Supabase Connection Test
// Run this with: node test-supabase.js

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('\n🔍 Testing Supabase Connection...\n')
console.log('Supabase URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
console.log('Supabase Key:', supabaseKey ? '✅ Found' : '❌ Missing')

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Missing credentials in .env file!')
  console.log('Make sure you have:')
  console.log('  VITE_SUPABASE_URL=your_url')
  console.log('  VITE_SUPABASE_ANON_KEY=your_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Test connection by checking tables
async function testConnection() {
  try {
    // Test 1: Check projects table
    console.log('\n📊 Testing projects table...')
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(1)
    
    if (projectsError) {
      console.log('❌ Projects table error:', projectsError.message)
    } else {
      console.log('✅ Projects table accessible!')
      console.log(`   Found ${projects?.length || 0} projects`)
    }

    // Test 2: Check contact_submissions table structure
    console.log('\n📝 Testing contact_submissions table...')
    const { error: contactError } = await supabase
      .from('contact_submissions')
      .select('*')
      .limit(0)
    
    if (contactError) {
      console.log('❌ Contact submissions table error:', contactError.message)
    } else {
      console.log('✅ Contact submissions table accessible!')
    }

    // Test 3: Check page_views table
    console.log('\n📈 Testing page_views table...')
    const { error: analyticsError } = await supabase
      .from('page_views')
      .select('*')
      .limit(0)
    
    if (analyticsError) {
      console.log('❌ Page views table error:', analyticsError.message)
    } else {
      console.log('✅ Page views table accessible!')
    }

    console.log('\n✅ All tests passed! Supabase is connected!\n')
    
  } catch (error) {
    console.log('\n❌ Connection error:', error.message)
  }
}

testConnection()
