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
