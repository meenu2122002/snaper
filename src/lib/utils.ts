import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function calTime(dt:string){
  // Parse the input date string
const dateString = dt;
const date = new Date(dateString);

// Calculate the difference in milliseconds between the current time and the input date
const timeDifference = Date.now() - date.getTime();

// Define the thresholds for different time units (in milliseconds)
const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;

// Calculate relative time based on the time difference
if (timeDifference < minute) {
    return("Just now");
} else if (timeDifference < 2 * minute) {
    return("A minute ago");
} else if (timeDifference < hour) {
    const minutesAgo = Math.floor(timeDifference / minute);
    return(`${minutesAgo} minutes ago`);
} else if (timeDifference < 2 * hour) {
    return("An hour ago");
} else if (timeDifference < day) {
    const hoursAgo = Math.floor(timeDifference / hour);
    return(`${hoursAgo} hours ago`);
} else if (timeDifference < 2 * day) {
    return("Yesterday");
} else {
    const daysAgo = Math.floor(timeDifference / day);
    return(`${daysAgo} days ago`);
}

}
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);
