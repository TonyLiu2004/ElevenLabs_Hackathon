"use client"

import { Card } from "@/components/ui/card"
import {
  Calendar,
  CalendarCheck,
  Clock,
  Zap,
  CheckCircle,
  MapPin,
  Building2,
  CalendarDays,
  Timer,
  Sparkles,
  UserCheck,
  Hospital,
} from "lucide-react"

export default function IconOptions() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center mb-8">Icon Options for Trust Indicators</h1>

      {/* Easy Scheduling Options */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Easy Scheduling Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Option 1: Calendar</h3>
            <p className="text-sm text-slate-600">Classic calendar icon</p>
          </Card>

          <Card className="p-4 text-center border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CalendarCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Option 2: Calendar Check</h3>
            <p className="text-sm text-slate-600">Shows completion/booking</p>
          </Card>

          <Card className="p-4 text-center border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CalendarDays className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Option 3: Calendar Days</h3>
            <p className="text-sm text-slate-600">More detailed calendar</p>
          </Card>
        </div>
      </div>

      {/* Real-time Availability Options */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Real-time Availability Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Option 1: Clock</h3>
            <p className="text-sm text-slate-600">Represents time/scheduling</p>
          </Card>

          <Card className="p-4 text-center border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Option 2: Zap</h3>
            <p className="text-sm text-slate-600">Shows speed/instant booking</p>
          </Card>

          <Card className="p-4 text-center border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Option 3: Sparkles</h3>
            <p className="text-sm text-slate-600">Modern, dynamic feel</p>
          </Card>
        </div>
      </div>

      {/* Local Providers Options */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Local Providers Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Option 1: Map Pin</h3>
            <p className="text-sm text-slate-600">Shows location/local</p>
          </Card>

          <Card className="p-4 text-center border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Hospital className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Option 2: Hospital</h3>
            <p className="text-sm text-slate-600">Medical facility icon</p>
          </Card>

          <Card className="p-4 text-center border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Option 3: User Check</h3>
            <p className="text-sm text-slate-600">Verified providers</p>
          </Card>
        </div>
      </div>

      {/* Alternative Color Schemes */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Alternative: Cohesive Blue Theme</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CalendarCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Easy Scheduling</h3>
            <p className="text-sm text-slate-600">Book appointments 24/7 with verified doctors</p>
          </Card>

          <Card className="p-4 text-center border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Real-time Availability</h3>
            <p className="text-sm text-slate-600">See live appointment slots and book instantly</p>
          </Card>

          <Card className="p-4 text-center border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Hospital className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Local Providers</h3>
            <p className="text-sm text-slate-600">Find qualified doctors in your area</p>
          </Card>
        </div>
      </div>

      {/* Medical-Focused Alternative */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Alternative: Medical-Focused Icons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Easy Scheduling</h3>
            <p className="text-sm text-slate-600">Simple checkmark for completion</p>
          </Card>

          <Card className="p-4 text-center border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Timer className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Real-time Availability</h3>
            <p className="text-sm text-slate-600">Timer for real-time updates</p>
          </Card>

          <Card className="p-4 text-center border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Local Providers</h3>
            <p className="text-sm text-slate-600">Building for medical facilities</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
