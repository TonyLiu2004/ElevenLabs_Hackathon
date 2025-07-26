"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Calendar, Clock, MapPin, Phone, Video, ArrowLeft } from "lucide-react"
import { Inter, Poppins, Source_Sans_3 } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
})

interface Appointment {
  id: string
  doctorName: string
  specialty: string
  date: string
  time: string
  type: "in-person" | "video" | "phone"
  status: "upcoming" | "completed" | "cancelled"
  location?: string
  reason: string
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: "2024-01-15",
    time: "10:30 AM",
    type: "in-person",
    status: "upcoming",
    location: "Heart Center, 123 Medical Plaza",
    reason: "Annual heart checkup",
  },
  {
    id: "2",
    doctorName: "Dr. Michael Chen",
    specialty: "Dermatologist",
    date: "2024-01-20",
    time: "2:15 PM",
    type: "video",
    status: "upcoming",
    reason: "Skin consultation follow-up",
  },
  {
    id: "3",
    doctorName: "Dr. Emily Rodriguez",
    specialty: "Primary Care",
    date: "2024-01-08",
    time: "9:00 AM",
    type: "in-person",
    status: "completed",
    location: "Main Clinic, 456 Health St",
    reason: "Annual physical exam",
  },
  {
    id: "4",
    doctorName: "Dr. James Wilson",
    specialty: "Orthopedist",
    date: "2024-01-25",
    time: "11:45 AM",
    type: "phone",
    status: "upcoming",
    reason: "Back pain consultation",
  },
]

export default function AppointmentsPage() {
  const upcomingAppointments = mockAppointments.filter((apt) => apt.status === "upcoming")
  const pastAppointments = mockAppointments.filter((apt) => apt.status === "completed")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />
      case "phone":
        return <Phone className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${inter.variable} ${poppins.variable} ${sourceSans.variable}`}
    >
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl shadow-sm">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 font-poppins">Iasys</h1>
                <p className="text-sm text-slate-600 font-source-sans">Your AI healthcare booking assistant</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <a
                href="/"
                className="text-sm font-medium text-slate-600 hover:text-pink-600 transition-colors font-poppins"
              >
                Chat
              </a>
              <a
                href="/appointments"
                className="text-sm font-medium text-pink-600 border-b-2 border-pink-600 pb-1 font-poppins"
              >
                Appointments
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <a href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <h2 className="text-2xl font-bold text-slate-900 font-poppins">My Appointments</h2>
          </div>
          <p className="text-slate-600 font-source-sans">Manage your upcoming and past medical appointments</p>
        </div>

        {/* Upcoming Appointments */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-poppins">Upcoming Appointments</h3>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-slate-900 font-poppins">{appointment.doctorName}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {appointment.specialty}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>{appointment.status}</Badge>
                    </div>

                    <p className="text-slate-600 mb-3 font-source-sans">{appointment.reason}</p>

                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(appointment.type)}
                        <span className="capitalize">{appointment.type}</span>
                      </div>
                    </div>

                    {appointment.location && (
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Appointments */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-poppins">Past Appointments</h3>
          <div className="space-y-4">
            {pastAppointments.map((appointment) => (
              <Card key={appointment.id} className="p-6 opacity-75">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-slate-900 font-poppins">{appointment.doctorName}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {appointment.specialty}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>{appointment.status}</Badge>
                    </div>

                    <p className="text-slate-600 mb-3 font-source-sans">{appointment.reason}</p>

                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(appointment.type)}
                        <span className="capitalize">{appointment.type}</span>
                      </div>
                    </div>

                    {appointment.location && (
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Book Again
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Empty State for New Users */}
        {upcomingAppointments.length === 0 && pastAppointments.length === 0 && (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2 font-poppins">No appointments yet</h3>
            <p className="text-slate-600 mb-4 font-source-sans">
              Start by booking your first appointment with our AI assistant
            </p>
            <Button asChild>
              <a href="/">Book Appointment</a>
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
