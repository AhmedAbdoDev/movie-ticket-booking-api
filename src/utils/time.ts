export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number) as [number, number];
  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  )
    throw new Error("Invalid time format");
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 1439)
    throw new Error("Invalid minutes value");
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

export const combineDateAndMinutes = (date: Date, minutes: number): Date => {
  const result = new Date(date);

  result.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);

  return result;
};

export const getTimeDuration = (startTime: number, endTime: number): number => {
  if (endTime >= startTime) return endTime - startTime;

  return 1440 - startTime + endTime;
};
