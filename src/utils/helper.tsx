export function isError(e: unknown): e is Error {
  return e instanceof Error;
}

export const moduleRoles = {
"/dashboard": {
  role: [1, 2]
}
}  


export const hasAccess = (roles: number[], module: string | null = null) => {
const pathname = module ?? window.location.pathname;
if (pathname in moduleRoles) {
  const role = moduleRoles[pathname as keyof typeof moduleRoles];
  if (role) {
    return role.role.some((r) => roles.includes(r));
  }
  return false;
}
return false;
}
