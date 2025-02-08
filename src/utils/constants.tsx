
export const API_METHODS = {
    GET: 'GET',
    POST: 'POST',
    DELETE: 'DELETE',
    PUT: 'PUT'
}



export const ENDPOINTS = {
    login: '/login',
    register: '/register',
    profile: '/profile',
}

export const MODULES = {
    ADMIN: "admin",
    COMPANY: "company",
    SUPERVISOR: "supervisor",
    DOCTOR: "doctors",
    HOSPITAL: "hospitals",
    LABORATORY: "laboratories",
    DEPARTMENT: "departments",
    AVAILABILITY: "availability",
    APPOINTMENT: "appointments",
    REVIEW: "reviews",
    OFFER: "offer",
    PATIENTS:'patients',
    SERVICES:'services',
    HR:'hr',
    REPORT:'report',
    SERVICE_IMAGES:'service-images'
};


//"SCHD", "COMP", "CNCL", "NOSH"
export const APPOINTMENT_STATUS = {
    SCHEDULED: 1,
    COMPLETED: 2,
    CANCELLED: 3,
    NO_SHOW: 4
}

//"PD", "PND", "FLD"
export const PAYMENT_STATUS = {
    PAID: 1,
    PENDING: 2,
    FAILED: 3
}