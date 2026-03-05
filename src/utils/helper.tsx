import { MODULES } from "./constants";
import { doPOST } from "./HttpUtils";
import { api } from "../services/api/apiHandler";

export function isError(e: unknown): e is Error {
  return e instanceof Error;
}



export const moduleRoles = {
  "/dashboard": [MODULES.ADMIN,MODULES.SUPERVISOR, MODULES.USER],
  "/stats": [MODULES.SUPERVISOR, MODULES.HR, MODULES.MARKETING],
  "/patient-list": [ MODULES.SUPERVISOR, MODULES.DOCTOR, MODULES.HR, MODULES.LABORATORY],
  "/patient-info/1": [ MODULES.SUPERVISOR, MODULES.DOCTOR],
  "/profile": [MODULES.DOCTOR],
  "/appointments": [MODULES.SUPERVISOR, MODULES.DOCTOR, MODULES.HR, MODULES.LABORATORY],
  "/doctor-list": [MODULES.HR],
  "/laboratory-list": [MODULES.HR],
  "/admin": [MODULES.SUPERVISOR],
  "/company": [MODULES.ADMIN],
  "/push-notification": [MODULES.SUPERVISOR],
  "/wellness-events": [MODULES.SUPERVISOR],
  "/departments": [MODULES.SUPERVISOR],
  "/services": [MODULES.SUPERVISOR],
  "/offers": [MODULES.SUPERVISOR, MODULES.MARKETING],
  "/hr-list": [MODULES.SUPERVISOR],
  "/report": [MODULES.DOCTOR, MODULES.LABORATORY, MODULES.SUPERVISOR,],
  "/service-images": [MODULES.SUPERVISOR, MODULES.MARKETING],
  "/gallery-images": [MODULES.SUPERVISOR, MODULES.MARKETING],
  "/event": [MODULES.SUPERVISOR, MODULES.MARKETING],
  // "/event": [MODULES.ADMIN, MODULES.SUPERVISOR,MODULES.MARKETING],
  "/packages": [MODULES.SUPERVISOR,],
  "/forms": [MODULES.SUPERVISOR,],
  "/blogs": [MODULES.SUPERVISOR, MODULES.MARKETING],
  "/second-opinion": [MODULES.SUPERVISOR, MODULES.MARKETING],
  "/ewa-package": [MODULES.SUPERVISOR, MODULES.MARKETING],
  "/corporate-plan": [MODULES.SUPERVISOR, MODULES.MARKETING],
  "/surgery": [MODULES.SUPERVISOR, MODULES.MARKETING],
  "/superblogs": [ MODULES.SUPERVISOR, MODULES.MARKETING],
  "/external-packages": [ MODULES.SUPERVISOR,],
  "/company-external-packages": [ MODULES.SUPERVISOR,],
  "/vendors": [ MODULES.SUPERVISOR,],
  "/marketing": [ MODULES.SUPERVISOR],
  "/banners": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.MARKETING, MODULES.USER],
  "/health-tips": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.MARKETING, MODULES.USER],
  "/users": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.USER],
  "/partners": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.USER],
  "/slots": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.USER],
  "/coupons": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.USER],
  "/bookings": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.USER],
}


export const hasAccess = (roles: string[] | string | null | undefined, module: string | null = null) => {
  const pathname = module ?? window.location.pathname;

  // Normalize roles to an array
  const normalizedRoles = Array.isArray(roles)
    ? roles
    : (roles ? [roles] : []);

  if (pathname in moduleRoles) {
    const allowedRoles = moduleRoles[pathname as keyof typeof moduleRoles];
    if (allowedRoles) {
      return allowedRoles.some((r: any) => normalizedRoles.includes(r));
    }
    return false;
  }
  return true; // If path not in moduleRoles, allow access by default or define your policy
}


export const uploadFile = async (data: any, files: any) => {
  const formData = new FormData();

  Array.from(files).forEach((file: any) => {
    formData.append('files', file);
  });

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  const response = await doPOST('/file/upload', formData);

  return response;
}

export const downloadFile = async (src: string) => {
  try {
    const response = await api({
      url: src,
      headers: {
        Authorization: localStorage.getItem("BearerToken") || '',
      },
      withCredentials: false,
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", src.split("/").pop() || "file");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};


export const isAdminOrSuperVisorOrHR = (userData: any) => Array.isArray(userData.role) && [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.HR].some(role => userData.role.includes(role))


export const timeConverter = {
  toHHMM: (hhmmss: string) => {
    if (!hhmmss) return '';
    const [hh = '00', mm = '00'] = hhmmss.split(':');
    return `${hh}${mm}`;
  },

  toHHMMSS: (hhmm: string) => {
    if (!hhmm || hhmm.length < 3) return '00:00:00';
    const hh = hhmm.slice(0, 2).padStart(2, '0');
    const mm = hhmm.slice(2).padStart(2, '0');
    return `${hh}:${mm}:00`;
  }
};