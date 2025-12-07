/**
 * Format student ID to xx-xxxx-xxx format
 * Removes all non-numeric characters first, then applies formatting
 * @param {string} studentId - The student ID to format
 * @returns {string} Formatted student ID
 */
export const formatStudentId = (studentId) => {
  if (!studentId) return "";

  // Remove all non-numeric characters
  const cleaned = studentId.replace(/\D/g, "");

  // If less than 8 digits, return as is
  if (cleaned.length < 8) return cleaned;

  // Format as xx-xxxx-xxx (first 2 digits, dash, next 4 digits, dash, remaining digits)
  return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6, 9)}`;
};

/**
 * Convert 24-hour military time to 12-hour format with AM/PM
 * Handles time strings like "14:30" and returns "2:30 PM"
 * @param {string} militaryTime - Time in HH:mm format (24-hour)
 * @returns {string} Time in h:mm AM/PM format (12-hour)
 */
export const formatTo12Hour = (militaryTime) => {
  if (!militaryTime) return "";

  try {
    // Parse the time string
    const [hours, minutes] = militaryTime.split(":").map(Number);
    
    // Validate input
    if (isNaN(hours) || isNaN(minutes)) return militaryTime;

    // Convert to 12-hour format
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    
    return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
  } catch (error) {
    console.warn("Error formatting time:", militaryTime, error);
    return militaryTime;
  }
};
