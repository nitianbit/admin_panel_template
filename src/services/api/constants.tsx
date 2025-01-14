
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
    create: (module:string)=>`/${module}/create`,
    bulkCreate: (module:string)=>`/bulk-upload/${module}`,
    update: (module: string)=>`/${module}/update`,
    delete: (module:string,id:string)=>`/${module}/${id}/delete`,
    detail: (module:string,id:string)=>`/${module}/${id}/detail`,
    grid: (module:string)=>`/${module}/grid`,
    count: (module:string)=>`/${module}/count`,
}