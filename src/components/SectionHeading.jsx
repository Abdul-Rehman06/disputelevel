export default function SectionHeading({ as: Tag = 'h2', children }) {
  return <Tag className={'content-heading ' + Tag}>{children}</Tag>;
}
