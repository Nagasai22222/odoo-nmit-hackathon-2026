/**
 * Generates an employee Login ID based on company name, employee name, joining date, and a serial number.
 * Format: [First 2 letters of Company] + [First 2 letters of First/Last Name] + [Year] + [4-digit Serial]
 * Example: OIJODO20220001
 * 
 * @param companyName e.g. "Odin India"
 * @param firstName e.g. "John"
 * @param lastName e.g. "Doe"
 * @param joinDate e.g. new Date('2022-01-01')
 * @param serialNumber e.g. 1
 */
export function generateEmployeeId(
  companyName: string,
  firstName: string,
  lastName: string,
  joinDate: Date,
  serialNumber: number
): string {
  // 1. Get first 2 letters of company name (ignoring spaces, uppercase)
  const cleanCompany = companyName.replace(/[^a-zA-Z]/g, '').toUpperCase()
  const compPrefix = cleanCompany.substring(0, 2).padEnd(2, 'X')

  // 2. Get first letter of first name + first letter of last name, OR first two of first name (uppercase)
  // Wait, the wireframe said: "JODO -> First two letters of the employee's first name and last name"
  // So it's 2 letters from First Name + 2 letters from Last Name
  const cleanFirst = firstName.replace(/[^a-zA-Z]/g, '').toUpperCase()
  const cleanLast = lastName.replace(/[^a-zA-Z]/g, '').toUpperCase()
  const namePrefix = cleanFirst.substring(0, 2).padEnd(2, 'X') + cleanLast.substring(0, 2).padEnd(2, 'X')

  // 3. Year of joining
  const year = joinDate.getFullYear().toString()

  // 4. 4-digit serial number
  const serial = serialNumber.toString().padStart(4, '0')

  return `${compPrefix}${namePrefix}${year}${serial}`
}
