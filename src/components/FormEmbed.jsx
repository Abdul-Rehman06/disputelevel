import { useExternalScript } from '../hooks/useExternalScript';

export default function FormEmbed({ src, title, className = '' }) {
  useExternalScript('https://link.kbcnsult.com/js/form_embed.js');
  return (
    <div className={'embed-frame ' + className}>
      <iframe src={src} title={title} scrolling="no" loading="lazy" />
    </div>
  );
}
