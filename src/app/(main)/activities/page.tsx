import { redirect } from 'next/navigation'

export default function ActivitiesPage() {
  redirect('/news?category=activity')
}
