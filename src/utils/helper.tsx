import { MODULES } from "./constants";

export function isError(e: unknown): e is Error {
  return e instanceof Error;
}



export const moduleRoles = {
  "/dashboard": {
    role: [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.DOCTOR]
  },
  "/patient-list": {
    role: [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.DOCTOR]
  },
  "/patient-info/1": {
    role: [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.DOCTOR]
  },
  "/profile": {
    role: [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.DOCTOR]
  },
  "/appointments":{
    role: [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.DOCTOR]
  },
  "/calender":{
    role: [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.DOCTOR]
  },
  "/doctor-list":{
    role:[MODULES.ADMIN]
  }

}


export const hasAccess = (roles: string[], module: string | null = null) => {
  const pathname = module ?? window.location.pathname;
  if (pathname in moduleRoles) {
    const role = moduleRoles[pathname as keyof typeof moduleRoles];
    if (role) {
      return role.role.some((r: any) => roles.includes(r));
    }
    return false;
  }
  return false;
}
