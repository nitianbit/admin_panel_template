
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
    USER: "user",
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
    PATIENTS: 'patients',
    SERVICES: 'services',
    HR: 'hr',
    REPORT: 'report',
    SERVICE_IMAGES: 'service-images',
    GALLERY_IMAGES: 'gallery-image',
    EVENT: 'event',
    PACKAGES: 'package',
    FORM: 'form',
    BLOGS: 'blogs',
    SUPERBLOGS: 'superblogs',
    VENDORS: 'vendors',
    MARKETING: 'marketing',
    SURGERY: 'surgery',
    SECOND_OPINION: 'second-opinion',
    EWA_PACKAGE: 'ewa-package',
    CORPORATE_PLAN: 'corporate-plan',
    BANNER: 'banners',
    SPECIALIST: 'specialists',
    WELLNESS_PACKAGE: 'wellness-packages',
    HEALTH_TIP: 'health-tips',
    PARTNER: 'partners',
    SLOTS: 'slots',
    COUPON: 'coupons',
    BOOKING: 'bookings',
    CORPORATE: 'corporates',
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