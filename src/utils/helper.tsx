import { MODULES } from "./constants";
import { doPOST } from "./HttpUtils";

export function isError(e: unknown): e is Error {
  return e instanceof Error;
}



export const moduleRoles = {
  "/dashboard": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.DOCTOR],
  "/patient-list": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.DOCTOR],
  "/patient-info/1": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.DOCTOR],
  "/profile": [MODULES.DOCTOR],
  "/appointments": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.DOCTOR],
  "/doctor-list": [MODULES.ADMIN],
  "/laboratory-list": [MODULES.ADMIN],
  "/admin": [MODULES.SUPERVISOR],
  "/company": [MODULES.ADMIN],
  "/push-notification": [MODULES.ADMIN],
  "/wellness-events": [MODULES.ADMIN],
  "/departments": [MODULES.ADMIN],
  "/services": [MODULES.ADMIN],
  "/offers": [MODULES.ADMIN],
}


export const hasAccess = (roles: string[], module: string | null = null) => {
  const pathname = module ?? window.location.pathname;
  if (pathname in moduleRoles) {
    const role = moduleRoles[pathname as keyof typeof moduleRoles];
    if (role) {
      return role.some((r: any) => roles.includes(r));
    }
    return false;
  }
  return false;
}


export const uploadFile = async (data: any,files: any) => {
  const formData = new FormData();

  Array.from(files).forEach((file: any) => {
    formData.append('pic', file);
  });

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  const response = await doPOST('/file/upload', formData);
 
  return response;
}
