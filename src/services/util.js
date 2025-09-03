import { parse, format } from "date-fns";

export const convertTo12HourDateTime = (dateStr) => {
    // Parse from "dd-MM-yyyy HH:mm"
    const parsedDate = parse(dateStr, "dd-MM-yyyy HH:mm", new Date());
  
    // Format to "MMM dd, yyyy hh:mm a" (e.g. "Aug 31, 2025 03:45 PM")
    return format(parsedDate, "dd MMM, yy hh:mm a");
}

export const JsDate = dateStr => {
    return parse(dateStr, "dd-MM-yyyy HH:mm", new Date());
}

export const ApiDate = date => {
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