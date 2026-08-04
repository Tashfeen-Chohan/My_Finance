export function triggerHaptic(type = "light") {
  if (typeof window === "undefined" || !("vibrate" in navigator)) return;

  try {
    switch (type) {
      case "light":
        navigator.vibrate(10);
        break;
      case "medium":
        navigator.vibrate(20);
        break;
      case "heavy":
        navigator.vibrate(35);
        break;
      case "success":
        navigator.vibrate([10, 30, 15]);
        break;
      case "warning":
      case "error":
        navigator.vibrate([30, 50, 30]);
        break;
      default:
        navigator.vibrate(10);
    }
  } catch {
    // Ignore permissions/unsupported errors silently
  }
}
