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
    if (!utcTimestamp) {
      return "N/A";
    }

    const date = new Date(utcTimestamp);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch {
    return "Invalid Date";
  }
};

export const formatUTCDateOnly = (utcTimestamp: string): string => {
  return formatUTCDate(utcTimestamp, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatUTCTimeOnly = (utcTimestamp: string): string => {
  return formatUTCDate(utcTimestamp, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export const getTimezoneOffset = (): string => {
  const offset = new Date().getTimezoneOffset();
  const hours = Math.abs(Math.floor(offset / 60));
  const minutes = Math.abs(offset % 60);
  const sign = offset <= 0 ? "+" : "-";

  return `UTC${sign}${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

export const parseDateOnly = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const compareDateStrings = (date1: string, date2: string): number => {
  return date1.localeCompare(date2);
};

export const calculateDateDifference = (
  fromDateStr: string,
  toDateStr: string
): number => {
  const fromDate = parseDateOnly(fromDateStr);
  const toDate = parseDateOnly(toDateStr);
  return (
    Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) +
    1
  );
};

export const isDateInRange = (
  checkDateStr: string,
  fromDateStr: string,
  toDateStr: string
): boolean => {
  return checkDateStr >= fromDateStr && checkDateStr <= toDateStr;
};
