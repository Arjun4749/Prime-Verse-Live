import { supabase } from './supabase';

export async function signUpWithEmail(
  email: string,
  password: string,
  username?: string,
  gameName?: string,
  bgmiId?: string
) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username || '',
        game_name: gameName || '',
        bgmi_id: bgmiId || '',
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signInWithEmail(
  email: string,
  password: string
) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOutUser() {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getCurrentSupabaseUser() {
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}