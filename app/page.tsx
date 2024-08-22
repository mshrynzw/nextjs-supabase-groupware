"use client"
import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const HomePage = () => {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }

    fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.unsubscribe?.() // もしunsubscribeが存在すれば呼び出す
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login") // ログアウト後にリダイレクト
  }

  return (
    <div>
      <h1>ホームページ</h1>
      {user ? (
        <div>
          <p>ようこそ, {user.email}!</p>
          <button onClick={handleLogout}>ログアウト</button>
        </div>
      ) : (
        <p>ログインしてください。</p>
      )}
    </div>
  )
}

export default HomePage