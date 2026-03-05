
export const API_METHODS = {
    GET: 'GET',
    POST: 'POST',
    DELETE: 'DELETE',
    PUT: 'PUT'
}



export const ENDPOINTS = {
    login: '/auth/admin/send',
    register: '/register',
    profile: '/profile',
    create: (module: string) => `/${module}/create`,
    bulkCreate: (module: string) => `/bulk-upload/${module}`,
    update: (module: string) => `/${module}/update`,
    delete: (module: string, id: string) => `/${module}/${id}/delete`,
    detail: (module: string, id: string) => `/${module}/${id}/detail`,
    grid: (module: string) => `/${module}/grid`,
    dashboardStats: '/dashboard/stats',
    dashboardAnalytics: (dateFrom: string, dateTo: string) => `/dashboard/analytics?dateFrom=${dateFrom}&dateTo=${dateTo}`,
    stats: (module: string) => `/dashboard/${module}`,
    externalPackage: (vendor: string) => `/schedule/available-packages?vendor=${vendor}`,
    externalSlots: (vendor: string, date: string | number) => `/schedule/available-slots?vendor=${vendor}&date=${date}`
}