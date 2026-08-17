const bookingLocks = new Set<string>();
const LOCK_TIMEOUT = 10 * 1000;

export const acquireBookingLock = (showtimeId: string) => {
  if (bookingLocks.has(showtimeId)) return false;
  bookingLocks.add(showtimeId);
  setTimeout(() => bookingLocks.delete(showtimeId), LOCK_TIMEOUT);
  return true;
};

export const releaseBookingLock = (showtimeId: string) => {
  bookingLocks.delete(showtimeId);
};
