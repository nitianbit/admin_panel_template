import PeopleIcon from "@mui/icons-material/People";
import TodayIcon from "@mui/icons-material/Today";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import MedicationIcon from '@mui/icons-material/Medication';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

export interface DASHBOARD_STATS {
    totalAppointmentsThisMonth: Number,
    totalAppointmentsThisWeek: Number,
    totalAppointmentsToday: Number,
    totalCompanies: Number,
    totalDoctors: Number,
    totalPatients: Number,
}
export const dashboard_default_stats: DASHBOARD_STATS = {
    totalAppointmentsThisMonth: 0,
    totalAppointmentsThisWeek: 0,
    totalAppointmentsToday: 0,
    totalCompanies: 0,
    totalDoctors: 0,
    totalPatients: 0,
}

export const dashboardCards=[
    {
        title: "Appointments This Month",
        value: 'totalAppointmentsThisMonth' as keyof DASHBOARD_STATS,
        icon: <TodayIcon />,
        color: "primary"
    },
    {
        title: "Appointments This Week",
        value:'totalAppointmentsThisWeek' as keyof DASHBOARD_STATS,
        icon: <TodayIcon />,
        color: "primary"
    },
    {
        title: "Appointments Today",
        value:'totalAppointmentsToday' as keyof DASHBOARD_STATS,
        icon: <TodayIcon />,
        color: "primary"
    },
    {
        title: "Companies",
        value:'totalCompanies' as keyof DASHBOARD_STATS,
        icon: <CorporateFareIcon />,
        color: "primary"
    },
    {
        title: "Doctors",
        value: 'totalDoctors' as keyof DASHBOARD_STATS,
        icon: <MedicationIcon />,
        color: "primary"
    },
    {
        title: "Patients",
        value: 'totalPatients' as keyof DASHBOARD_STATS,
        icon: <PeopleIcon />,
        color: "primary"
    }
]