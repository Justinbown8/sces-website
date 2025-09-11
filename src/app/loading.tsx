import PageLoader from '@/components/ui/PageLoader';

export default function Loading() {
  return (
    <PageLoader 
      message="Loading page content..." 
      size="md"
      fullScreen={false}
    />
  );
}