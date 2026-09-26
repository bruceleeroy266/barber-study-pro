'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface StudentOption {
  id: string
  full_name: string
  email: string
}

interface Props {
  students: StudentOption[]
  selectedStudentId: string
}

export default function StudentHoursDropdown({ students, selectedStudentId }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleChange(studentId: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (studentId) {
      params.set('student', studentId)
    } else {
      params.delete('student')
    }

    params.delete('saved')
    params.delete('error')
    params.delete('reviewed')
    params.delete('alreadyReviewed')

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-silver">Student</span>
      <select
        value={selectedStudentId}
        onChange={(event) => handleChange(event.target.value)}
        className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
      >
        {students.map((student) => (
          <option key={student.id} value={student.id} className="bg-black text-white">
            {student.full_name} — {student.email}
          </option>
        ))}
      </select>
    </label>
  )
}
