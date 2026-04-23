interface UseBookingActionsArgs {
  cancelBooking: (id: string) => Promise<unknown>;
  checkInBooking: (id: string) => Promise<unknown>;
  checkOutBooking: (id: string) => Promise<unknown>;
  createReview?: (id: string, rating: number, comment?: string) => Promise<unknown>;
  refresh: () => Promise<void>;
}

export function useBookingActions({
  cancelBooking,
  checkInBooking,
  checkOutBooking,
  createReview,
  refresh,
}: UseBookingActionsArgs) {
  const confirmAndRun = async (
    confirmMsg: string,
    fn: () => Promise<unknown>,
    errMsg: string,
  ) => {
    if (!confirm(confirmMsg)) return;
    try {
      await fn();
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : errMsg);
    }
  };

  return {
    handleCancel: (id: string) =>
      confirmAndRun(
        "Are you sure you want to cancel this booking?",
        () => cancelBooking(id),
        "Failed to cancel booking.",
      ),
    handleCheckIn: (id: string) =>
      confirmAndRun(
        "Confirm check-in for this guest?",
        () => checkInBooking(id),
        "Failed to check in.",
      ),
    handleCheckOut: (id: string) =>
      confirmAndRun(
        "Confirm check-out for this guest?",
        () => checkOutBooking(id),
        "Failed to check out.",
      ),
    handleReview: async (id: string, rating: number, comment?: string) => {
      if (!createReview) return;
      try {
        await createReview(id, rating, comment);
        await refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to post review.");
        throw err;
      }
    },
  };
}
