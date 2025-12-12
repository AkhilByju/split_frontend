// app/session/[code].tsx
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { fetchSessionBundle, formatDollars } from '../../src/api'

export default function SessionScreen() {
  const { code } = useLocalSearchParams<{ code?: string }>() // from URL
  const [session, setSession] = useState<any | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        if (!code) {
          setError('No session code provided')
          setLoading(false)
          return
        }

        setLoading(true)
        setError(null)

        const { session, users } = await fetchSessionBundle(String(code))
        setSession(session)
        setUsers(users)
      } catch (err) {
        console.error(err)
        setError('Failed to load bill')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [code])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  if (error || !session) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={{ color: 'red', textAlign: 'center' }}>
          {error || 'Bill not found'}
        </Text>
      </View>
    )
  }

  const subtotal = formatDollars(session.subtotal_cents)
  const tax = formatDollars(session.tax_cents)
  const tip = formatDollars(session.tip_cents)
  const total = formatDollars(session.needed_cents)

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f8f8f8' }}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      {/* Header */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '700' }}>
          {session.merchant}
        </Text>
        <Text style={{ color: '#555', marginTop: 4 }}>
          Code: <Text style={{ fontWeight: '600' }}>{session.code}</Text>
        </Text>
        <Text style={{ color: '#777', marginTop: 2 }}>
          Created: {new Date(session.created_at).toLocaleString()}
        </Text>
      </View>

      {/* Totals */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 12,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
          Bill summary
        </Text>

        <Row label="Subtotal" value={subtotal} />
        <Row label="Tax" value={tax} />
        <Row label="Tip" value={tip} />

        <View
          style={{
            height: 1,
            backgroundColor: '#eee',
            marginVertical: 6,
          }}
        />

        <Row label="Total" value={total} bold />
      </View>

      {/* Participants */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 12,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
          People in this bill
        </Text>

        {users.length === 0 ? (
          <Text style={{ color: '#777' }}>No one has joined yet.</Text>
        ) : (
          users.map((u) => (
            <View
              key={u.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 4,
              }}
            >
              <Text>{u.display_name}</Text>
              {u.is_host && (
                <Text style={{ fontSize: 12, color: '#555' }}>
                  host
                </Text>
              )}
            </View>
          ))
        )}
      </View>

      {/* Items placeholder */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 12,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
          Items
        </Text>
        <Text style={{ color: '#777' }}>
          Items will show up here once we wire them in.
        </Text>
      </View>
    </ScrollView>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
      }}
    >
      <Text style={bold ? { fontWeight: '700' } : undefined}>{label}</Text>
      <Text style={bold ? { fontWeight: '700' } : undefined}>{value}</Text>
    </View>
  )
}
