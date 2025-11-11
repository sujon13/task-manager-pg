import { parse, format, isValid } from "date-fns";
import { RoleEnum } from "../context/RoleEnum";

export const convertTo12HourDateTime = (dateStr, forView = false) => {
    if (!dateStr) {
        return null;
    }
    // Parse from "dd-MM-yyyy HH:mm"
    const parsedDate = parse(dateStr, "dd-MM-yyyy HH:mm", new Date());
    if (!isValid(parsedDate)) {
        return null;
    }
  
    // Format to "MMM dd, yyyy hh:mm a" (e.g. "Aug 31, 2025 03:45 PM")
    const dateFormat = forView ? 'MMM dd, yyyy h:mm a' : 'dd MMM, yy h:mm a';
    return format(parsedDate, dateFormat);
}

export const JsDate = dateStr => {
    return parse(dateStr, "dd-MM-yyyy HH:mm", new Date());
}

export const ApiDate = date => {
    if (!date)return null;
    return format(date, "dd-MM-yyyy HH:mm");
}

export const getUrl = (path, paramMap) => {
    let url = path;
    if (paramMap) {
        url += '?' + Object.entries(paramMap).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    }
    return url;
}

export const capitalizeFirst = str => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const isSupervisor = user => {
    const supervisorRoles = [ RoleEnum.ADMIN.key, RoleEnum.SCADA_SE.key, RoleEnum.SMD_XEN.key, RoleEnum.CNST_XEN.key ];
    return user?.roles?.some(role => supervisorRoles.includes(role.name));
}

export const isSmdXen = user => {
    return user?.roles?.some(role => RoleEnum.SMD_XEN.key === role.name);
}

export const isCnstXen = user => {
    return user?.roles?.some(role => RoleEnum.CNST_XEN.key === role.name);
}