import Link from 'next/link';
import { StructuredData } from './StructuredData';
import { generateBreadcrumbStructuredData } from '@/lib/structured-data';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const structuredData = generateBreadcrumbStructuredData(items);

  return (
    <>
      <StructuredData data={structuredData} />
      <nav className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`} aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => (
            <li key={item.url} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 mx-2 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {index === items.length - 1 ? (
                <span className="text-gray-900 font-medium truncate" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-blue-600 transition-colors truncate"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}