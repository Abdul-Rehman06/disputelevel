import { useEffect } from 'react';

export function useDocumentMetadata(title, description) {
  useEffect(() => {
    document.title = title;
    const element = document.querySelector('meta[name="description"]');
    if (element && description) element.setAttribute('content', description);
  }, [description, title]);
}
