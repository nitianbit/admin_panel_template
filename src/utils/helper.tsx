import { MODULES } from "./constants";

export function isError(e: unknown): e is Error {
    return e instanceof Error;
  }

  

export const moduleRoles = {
  "/dashboard": {
    role: [MODULES.ADMIN,MODULES.SUPERVISOR]
  }
}  


export const hasAccess = (roles: number[], module: string | null = null) => {
  const pathname = module ?? window.location.pathname;
  if (pathname in moduleRoles) {
    const role = moduleRoles[pathname as keyof typeof moduleRoles];
    if (role) {
      return role.role.some((r:any) => roles.includes(r));
    }
    return false;
  }
  return false;
}
