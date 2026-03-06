import PeopleIcon from "@mui/icons-material/People"
import TodayIcon from "@mui/icons-material/Today"
import MedicationIcon from "@mui/icons-material/Medication"
import CorporateFareIcon from "@mui/icons-material/CorporateFare"
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee"
import EventBusyIcon from "@mui/icons-material/EventBusy"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import BookOnlineIcon from "@mui/icons-material/BookOnline"

export interface DASHBOARD_STATS {
  totalAppointmentsThisMonth: number
  totalAppointmentsThisWeek: number
  totalAppointmentsToday: number
  totalCompanies: number
  totalDoctors: number
  totalPatients: number
}
export const dashboard_default_stats: DASHBOARD_STATS = {
  totalAppointmentsThisMonth: 0,
  totalAppointmentsThisWeek: 0,
  totalAppointmentsToday: 0,
  totalCompanies: 0,
  totalDoctors: 0,
  totalPatients: 0,
}

export const dashboardCards = [
  {
    title: "Appointments This Month",
    value: "totalAppointmentsThisMonth" as keyof DASHBOARD_STATS,
    icon: <TodayIcon />,
    color: "primary",
  },
  {
    title: "Appointments This Week",
    value: "totalAppointmentsThisWeek" as keyof DASHBOARD_STATS,
    icon: <TodayIcon />,
    color: "primary",
  },
  {
    title: "Appointments Today",
    value: "totalAppointmentsToday" as keyof DASHBOARD_STATS,
    icon: <TodayIcon />,
    color: "primary",
  },
  {
    title: "Companies",
    value: "totalCompanies" as keyof DASHBOARD_STATS,
    icon: <CorporateFareIcon />,
    color: "primary",
  },
  {
    title: "Doctors",
    value: "totalDoctors" as keyof DASHBOARD_STATS,
    icon: <MedicationIcon />,
    color: "primary",
  },
  {
    title: "Employees",
    value: "totalPatients" as keyof DASHBOARD_STATS,
    icon: <PeopleIcon />,
    color: "primary",
  },
]

// ---- Analytics Types ----

export interface BookingByType {
  bookingType: string
  count: number
  amount: number
}

export interface BookingByStatus {
  status: string
  count: number
  amount: number
}

export interface BookingTrend {
  date: string
  count: number
  amount: number
}

export interface RevenueTrend {
  date: string
  amount: number
  transactions: number
}

export interface AnalyticsOverview {
  totalBookings: number
  paidBookings: number
  cancelledBookings: number
  newUsers: number
  totalRevenue: number
  walletRechargeAmount: number
  walletUsageAmount: number
}

export interface AnalyticsBookings {
  byType: BookingByType[]
  byStatus: BookingByStatus[]
  totalValue: number
  paidValue: number
  pendingValue: number
}

export interface AnalyticsPayments {
  booking: {
    totalTransactions: number
    paidTransactions: number
    totalCollected: number
    totalDiscount: number
  }
  walletRecharge: {
    totalTransactions: number
    paidTransactions: number
    totalCollected: number
  }
}

export interface AnalyticsTrends {
  bookingsByDate: BookingTrend[]
  revenueByDate: RevenueTrend[]
}

export interface AnalyticsData {
  dateRange: {
    dateFrom: string
    dateTo: string
  }
  overview: AnalyticsOverview
  bookings: AnalyticsBookings
  payments: AnalyticsPayments
  trends: AnalyticsTrends
}

export const defaultAnalyticsData: AnalyticsData = {
  dateRange: { dateFrom: "", dateTo: "" },
  overview: {
    totalBookings: 0,
    paidBookings: 0,
    cancelledBookings: 0,
    newUsers: 0,
    totalRevenue: 0,
    walletRechargeAmount: 0,
    walletUsageAmount: 0,
  },
  bookings: {
    byType: [],
    byStatus: [],
    totalValue: 0,
    paidValue: 0,
    pendingValue: 0,
  },
  payments: {
    booking: {
      totalTransactions: 0,
      paidTransactions: 0,
      totalCollected: 0,
      totalDiscount: 0,
    },
    walletRecharge: {
      totalTransactions: 0,
      paidTransactions: 0,
      totalCollected: 0,
    },
  },
  trends: {
    bookingsByDate: [],
    revenueByDate: [],
  },
}

export const analyticsOverviewCards = [
  {
    title: "Total Bookings",
    key: "totalBookings" as keyof AnalyticsOverview,
    icon: <BookOnlineIcon />,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    title: "Paid Bookings",
    key: "paidBookings" as keyof AnalyticsOverview,
    icon: <TodayIcon />,
    gradient: "linear-gradient(135deg, #43C6AC 0%, #191654 100%)",
  },
  {
    title: "Cancelled Bookings",
    key: "cancelledBookings" as keyof AnalyticsOverview,
    icon: <EventBusyIcon />,
    gradient: "linear-gradient(135deg, #F5515F 0%, #A1051D 100%)",
  },
  {
    title: "New Users",
    key: "newUsers" as keyof AnalyticsOverview,
    icon: <PeopleIcon />,
    gradient: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
  },
  {
    title: "Total Revenue",
    key: "totalRevenue" as keyof AnalyticsOverview,
    icon: <CurrencyRupeeIcon />,
    prefix: "₹",
    gradient: "linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)",
  },
  {
    title: "Wallet Recharge",
    key: "walletRechargeAmount" as keyof AnalyticsOverview,
    icon: <AccountBalanceWalletIcon />,
    prefix: "₹",
    gradient: "linear-gradient(135deg, #52ACFF 0%, #0072FF 100%)",
  },
  {
    title: "Wallet Usage",
    key: "walletUsageAmount" as keyof AnalyticsOverview,
    icon: <AccountBalanceWalletIcon />,
    prefix: "₹",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
]
