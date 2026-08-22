import { Quote } from 'lucide-react';

export default function Testimonial({ children }) {
  return (
    <blockquote className="testimonial">
      <Quote aria-hidden="true" />
      <p>{children}</p>
    </blockquote>
  );
}
