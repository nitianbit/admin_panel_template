"use client"

import type React from "react"
import { useState, useEffect } from "react"

const ENDPOINTS = {
  stats: (resource: string) => `/api/stats/${resource}`,
}

interface Filters {
  date?: string
  location?: string
}

const ApiCalling: React.FC = () => {
  const [appointmentCount, setAppointmentCount] = useState<number | null>(null)
  const [doctorCount, setDoctorCount] = useState<number | null>(null)
  const [filters, setFilters] = useState<Filters>({})

  useEffect(() => {
    const fetchAppointmentCount = async () => {
      try {
        const queryParams = new URLSearchParams(filters)
        // Assuming there's a stats endpoint that can be used instead
        const url = `${ENDPOINTS.stats("appointments-count")}?${queryParams.toString()}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setAppointmentCount(data.count) // Assuming the response has a 'count' property
      } catch (error) {
        console.error("Could not fetch appointment count:", error)
        setAppointmentCount(null)
      }
    }

    const fetchDoctorCount = async () => {
      try {
        const queryParams = new URLSearchParams(filters)
        // Assuming there's a stats endpoint that can be used instead
        const url = `${ENDPOINTS.stats("doctors-count")}?${queryParams.toString()}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setDoctorCount(data.count) // Assuming the response has a 'count' property
      } catch (error) {
        console.error("Could not fetch doctor count:", error)
        setDoctorCount(null)
      }
    }

    fetchAppointmentCount()
    fetchDoctorCount()
  }, [filters])

  return (
    <div>
      {appointmentCount !== null ? <p>Appointment Count: {appointmentCount}</p> : <p>Loading appointment count...</p>}

      {doctorCount !== null ? <p>Doctor Count: {doctorCount}</p> : <p>Loading doctor count...</p>}
    </div>
  )
}

export default ApiCalling
