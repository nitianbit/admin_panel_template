import { MODULES } from "./constants";
import { doPOST } from "./HttpUtils";
import { api } from "../services/api/apiHandler";

export function isError(e: unknown): e is Error {
  return e instanceof Error;
}



export const moduleRoles = {
  "/dashboard": [MODULES.ADMIN, MODULES.SUPERVISOR],
  "/stats": [MODULES.ADMIN, MODULES.SUPERVISOR,MODULES.HR],
  "/patient-list": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.DOCTOR, MODULES.HR,MODULES.LABORATORY],
  "/patient-info/1": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.DOCTOR],
  "/profile": [MODULES.DOCTOR],
  "/appointments": [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.DOCTOR, MODULES.HR,MODULES.LABORATORY],
  "/doctor-list": [MODULES.ADMIN, MODULES.HR],
  "/laboratory-list": [MODULES.ADMIN, MODULES.HR],
  "/admin": [MODULES.SUPERVISOR],
  "/company": [MODULES.ADMIN],
  "/push-notification": [MODULES.ADMIN],
  "/wellness-events": [MODULES.ADMIN],
  "/departments": [MODULES.ADMIN],
  "/services": [MODULES.ADMIN],
  "/offers": [MODULES.ADMIN],
  "/hr-list": [MODULES.ADMIN, MODULES.SUPERVISOR],
  "/report": [MODULES.ADMIN, MODULES.DOCTOR, MODULES.LABORATORY],
  "/service-images": [MODULES.ADMIN],
  "/packages": [MODULES.ADMIN],
  "/forms": [MODULES.ADMIN],
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


export const uploadFile = async (data: any, files: any) => {
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

export const downloadFile = async (src:string) => {
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


export const isAdminOrSuperVisorOrHR = (userData:any) =>  Array.isArray(userData.role) && [MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.HR].some(role => userData.role.includes(role))