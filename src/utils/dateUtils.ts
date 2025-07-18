/**
 * Date utility functions for handling timezone conversions
 */

/**
 * Format a UTC timestamp to local timezone for display
 * @param utcTimestamp - UTC timestamp string from database
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string in local timezone
 */
export const formatUTCDate = (
  utcTimestamp: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }
): string => {
  try {
    const date = new Date(utcTimestamp);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

/**
 * Format a UTC timestamp to local date only
 * @param utcTimestamp - UTC timestamp string from database
 * @returns Formatted date string in local timezone
 */
export const formatUTCDateOnly = (utcTimestamp: string): string => {
  return formatUTCDate(utcTimestamp, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/**
 * Format a UTC timestamp to local time only
 * @param utcTimestamp - UTC timestamp string from database
 * @returns Formatted time string in local timezone
 */
export const formatUTCTimeOnly = (utcTimestamp: string): string => {
  return formatUTCDate(utcTimestamp, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

/**
 * Get the timezone offset for display purposes
 * @returns Timezone offset string (e.g., "UTC+5:30")
 */
export const getTimezoneOffset = (): string => {
  const offset = new Date().getTimezoneOffset();
  const hours = Math.abs(Math.floor(offset / 60));
  const minutes = Math.abs(offset % 60);
  const sign = offset <= 0 ? "+" : "-";

  return `UTC${sign}${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};
