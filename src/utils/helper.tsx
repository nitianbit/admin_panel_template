import { MODULES } from "./constants";
import { doPOST } from "./HttpUtils";
import { api } from "../services/api/apiHandler";

export function isError(e: unknown): e is Error {
  return e instanceof Error;
}



export const moduleRoles = {
  "/dashboard": [MODULES.SUPERVISOR, MODULES.USER, MODULES.ADMIN],
  "/stats": [MODULES.SUPERVISOR, MODULES.HR, MODULES.MARKETING, MODULES.ADMIN],
  "/patient-list": [ MODULES.SUPERVISOR, MODULES.DOCTOR, MODULES.HR, MODULES.LABORATORY, MODULES.ADMIN],
  "/patient-info/1": [ MODULES.SUPERVISOR, MODULES.DOCTOR, MODULES.ADMIN],
  "/profile": [MODULES.DOCTOR, MODULES.ADMIN],
  "/appointments": [MODULES.SUPERVISOR, MODULES.DOCTOR, MODULES.HR, MODULES.LABORATORY, MODULES.ADMIN],
  "/doctor-list": [MODULES.HR, MODULES.ADMIN],
  "/laboratory-list": [MODULES.HR, MODULES.ADMIN],
  "/admin": [MODULES.SUPERVISOR, MODULES.ADMIN],
  "/company": [MODULES.ADMIN],
  "/push-notification": [MODULES.SUPERVISOR, MODULES.ADMIN],
  "/wellness-events": [MODULES.SUPERVISOR, MODULES.ADMIN],
  "/departments": [MODULES.SUPERVISOR, MODULES.ADMIN],
  "/services": [MODULES.SUPERVISOR, MODULES.ADMIN],
  "/offers": [MODULES.SUPERVISOR, MODULES.MARKETING],
  "/hr-list": [MODULES.SUPERVISOR, MODULES.ADMIN],
  "/report": [MODULES.DOCTOR, MODULES.LABORATORY, MODULES.SUPERVISOR, MODULES.ADMIN],
  "/service-images": [MODULES.SUPERVISOR, MODULES.MARKETING, MODULES.ADMIN],
  "/gallery-images": [MODULES.SUPERVISOR, MODULES.MARKETING, MODULES.ADMIN  ],
  "/event": [MODULES.SUPERVISOR, MODULES.MARKETING, MODULES.ADMIN],
  // "/event": [MODULES.ADMIN, MODULES.SUPERVISOR,MODULES.MARKETING],
  "/packages": [MODULES.SUPERVISOR, MODULES.ADMIN],
  "/forms": [MODULES.SUPERVISOR, MODULES.ADMIN],
  "/blogs": [MODULES.SUPERVISOR, MODULES.MARKETING, MODULES.ADMIN],
  "/second-opinion": [MODULES.SUPERVISOR, MODULES.MARKETING, MODULES.ADMIN],
  "/ewa-package": [MODULES.SUPERVISOR, MODULES.MARKETING, MODULES.ADMIN],
  "/corporate-plan": [MODULES.SUPERVISOR, MODULES.MARKETING, MODULES.ADMIN],
  "/surgery": [MODULES.SUPERVISOR, MODULES.MARKETING, MODULES.ADMIN],
  "/superblogs": [ MODULES.SUPERVISOR, MODULES.MARKETING, MODULES.ADMIN],
  "/external-packages": [ MODULES.SUPERVISOR, MODULES.ADMIN],
  "/company-external-packages": [ MODULES.SUPERVISOR, MODULES.ADMIN],
  "/vendors": [ MODULES.SUPERVISOR, MODULES.ADMIN],
  "/marketing": [ MODULES.SUPERVISOR, MODULES.ADMIN],
  "/banners": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.MARKETING, MODULES.USER, MODULES.ADMIN],
  "/health-tips": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.MARKETING, MODULES.USER, MODULES.ADMIN],
  "/users": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.USER, MODULES.ADMIN],
  "/partners": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.USER, MODULES.ADMIN],
  "/slots": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.USER, MODULES.ADMIN],
  "/coupons": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.USER, MODULES.ADMIN],
  "/bookings": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.USER, MODULES.ADMIN],
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