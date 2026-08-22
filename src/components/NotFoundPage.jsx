import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';

export default function NotFoundPage() {
  useDocumentMetadata('Page Not Found | Dispute Levels', 'The requested page could not be found.');
  return (
    <main id="main-content" className="not-found">
      <p className="eyebrow">404 · PAGE NOT FOUND</p>
      <h1>This page isn’t part of the current site.</h1>
      <p>The requested page could not be found.</p>
      <Link to="/" className="button-primary"><ArrowLeft size={18} />Home</Link>
    </main>
  );
}
