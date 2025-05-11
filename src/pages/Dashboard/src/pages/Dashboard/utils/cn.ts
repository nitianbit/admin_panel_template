// Create a simplified utility function to replace the missing cn function
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}
