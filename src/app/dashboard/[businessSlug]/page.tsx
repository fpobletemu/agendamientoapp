import { redirect } from 'next/navigation'

export default async function BusinessRootPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>
}) {
  const { businessSlug } = await params
  redirect(`/dashboard/${businessSlug}/overview`)
}
