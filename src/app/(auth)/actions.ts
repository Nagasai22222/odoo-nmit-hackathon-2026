'use server'

import { prisma } from '@/lib/prisma'
import { setSession, clearSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const loginSchema = z.object({
  identifier: z.string().min(1, 'Login ID or Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function login(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData)
    const parsed = loginSchema.safeParse(data)
    
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message }
    }

    const { identifier, password } = parsed.data

    const isEmail = identifier.includes('@')

    let user = null
    let employee = null
    
    if (isEmail) {
      user = await prisma.user.findUnique({
        where: { email: identifier },
        include: { employee: true }
      })
      employee = user?.employee
    } else {
      employee = await prisma.employee.findUnique({
        where: { employeeId: identifier },
        include: { user: true }
      })
      user = employee?.user
    }

    if (!user) {
      return { error: 'Invalid credentials' }
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    
    if (!isValidPassword) {
      return { error: 'Invalid credentials' }
    }

    await setSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: employee?.employeeId,
    })

    // Redirect shouldn't be inside the try/catch if it expects to throw NEXT_REDIRECT
    // We will return success and handle redirect in client, OR we can redirect here outside the try/catch if we can.
    // For Server Actions, redirect() throws an error that Next.js catches.
    // So we just return success and let the client redirect, or we can use redirect right here.
    
  } catch (error) {
    if ((error as Error).message === 'NEXT_REDIRECT') {
      throw error // Re-throw redirect so Next.js can handle it
    }
    return { error: 'Something went wrong. Please try again.' }
  }

  // Find the role to determine where to redirect
  let userRole = 'EMPLOYEE'
  const identifier = formData.get('identifier') as string
  if (identifier.includes('@')) {
    userRole = (await prisma.user.findUnique({ where: { email: identifier } }))?.role || 'EMPLOYEE'
  } else {
    const emp = await prisma.employee.findUnique({ where: { employeeId: identifier }, include: { user: true } })
    userRole = emp?.user?.role || 'EMPLOYEE'
  }

  if (userRole === 'ADMIN') {
    redirect('/admin/profile')
  } else {
    redirect('/employee/employees')
  }
}

const signupSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Valid phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password confirmation is required'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export async function signup(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData)
    const parsed = signupSchema.safeParse(data)
    
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message }
    }

    const { companyName, name, email, phone, password } = parsed.data

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return { error: 'Email already exists' }
    }

    const passwordHash = await bcrypt.hash(password, 10)
    
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'EMPLOYEE',
        companyName,
        name,
        phone,
        employee: {
          create: {
            employeeId: `EMP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            firstName: name.split(' ')[0] || '',
            lastName: name.split(' ').slice(1).join(' ') || '',
            phone: phone,
          }
        }
      }
    })

    return { success: true }
  } catch (error) {
    return { error: 'Something went wrong during registration.' }
  }
}

export async function logout() {
  await clearSession()
  redirect('/login')
}
