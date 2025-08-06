import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    // Verify current user is authenticated and has admin role
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin - try profile first, then fallback to metadata
    let isAdmin = false;
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role_id')
        .eq('id', user.id)
        .single()
      
      if (profile && !profileError) {
        isAdmin = profile.role_id === '1';
      } else {
        // Fallback to user metadata
        console.log('Profile check failed, using metadata fallback');
        isAdmin = user.user_metadata?.role === 'admin';
      }
    } catch (error) {
      // Fallback to user metadata if profile access fails
      console.log('Profile access error, using metadata fallback');
      isAdmin = user.user_metadata?.role === 'admin';
    }
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Get users using admin client
    const { data: authUsers, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (usersError) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Get profiles data
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*')

    if (profilesError) {
      console.log('No profiles table or error:', profilesError.message)
    }

    // Get roles data
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('roles')
      .select('*')
      .order('name')

    return NextResponse.json({
      users: authUsers.users,
      profiles: profiles || [],
      roles: roles || []
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin - try profile first, then fallback to metadata
    let isAdmin = false;
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role_id')
        .eq('id', user.id)
        .single()
      
      if (profile && !profileError) {
        isAdmin = profile.role_id === '1';
      } else {
        // Fallback to user metadata
        console.log('Profile check failed, using metadata fallback');
        isAdmin = user.user_metadata?.role === 'admin';
      }
    } catch (error) {
      // Fallback to user metadata if profile access fails
      console.log('Profile access error, using metadata fallback');
      isAdmin = user.user_metadata?.role === 'admin';
    }
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { action, userData } = body

    switch (action) {
      case 'create':
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: userData.password || 'temporary123!',
          email_confirm: true,
          user_metadata: {
            name: userData.name,
            avatar_url: userData.avatar
          }
        })

        if (createError) {
          return NextResponse.json({ error: createError.message }, { status: 400 })
        }

        // Create profile if provided
        if (userData.roleId || userData.name) {
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert([{
              id: newUser.user.id,
              name: userData.name,
              avatar: userData.avatar,
              role_id: userData.roleId || '2',
              is_active: userData.isActive !== false,
              email_verified: true
            }])

          if (profileError) {
            console.log('Profile creation error:', profileError.message)
          }
        }

        return NextResponse.json({ user: newUser.user })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin - try profile first, then fallback to metadata
    let isAdmin = false;
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role_id')
        .eq('id', user.id)
        .single()
      
      if (profile && !profileError) {
        isAdmin = profile.role_id === '1';
      } else {
        // Fallback to user metadata
        console.log('Profile check failed, using metadata fallback');
        isAdmin = user.user_metadata?.role === 'admin';
      }
    } catch (error) {
      // Fallback to user metadata if profile access fails
      console.log('Profile access error, using metadata fallback');
      isAdmin = user.user_metadata?.role === 'admin';
    }
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, userData } = body

    // Update auth user metadata
    if (userData.name || userData.avatar) {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          name: userData.name,
          avatar_url: userData.avatar
        }
      })

      if (updateError) {
        console.error('Auth update error:', updateError)
      }
    }

    // Update profile
    const profileUpdate: any = { updated_at: new Date().toISOString() }
    if (userData.name) profileUpdate.name = userData.name
    if (userData.avatar) profileUpdate.avatar = userData.avatar
    if (userData.roleId) profileUpdate.role_id = userData.roleId
    if (userData.isActive !== undefined) profileUpdate.is_active = userData.isActive

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update(profileUpdate)
      .eq('id', userId)

    if (profileError) {
      console.log('Profile update error:', profileError.message)
    }

    // Handle ban/unban
    if (userData.isActive !== undefined) {
      const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        ban_duration: userData.isActive ? 'none' : '876000h'
      })

      if (banError) {
        console.error('Ban/unban error:', banError)
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin - try profile first, then fallback to metadata
    let isAdmin = false;
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role_id')
        .eq('id', user.id)
        .single()
      
      if (profile && !profileError) {
        isAdmin = profile.role_id === '1';
      } else {
        // Fallback to user metadata
        console.log('Profile check failed, using metadata fallback');
        isAdmin = user.user_metadata?.role === 'admin';
      }
    } catch (error) {
      // Fallback to user metadata if profile access fails
      console.log('Profile access error, using metadata fallback');
      isAdmin = user.user_metadata?.role === 'admin';
    }
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Delete profile first
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.log('Profile deletion error:', profileError.message)
    }

    // Delete auth user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
