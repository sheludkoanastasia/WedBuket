/**
 * WebP через <picture>; fallback — тот же webp или другой формат при необходимости.
 */
function Picture({
  webp,
  fallback,
  alt = '',
  className = '',
  imgClassName = '',
  loading,
  decoding = 'async',
  draggable,
  ...imgProps
}) {
  return (
    <picture className={className || undefined}>
      <source type="image/webp" srcSet={webp} />
      <img
        className={imgClassName || undefined}
        src={fallback}
        alt={alt}
        loading={loading}
        decoding={decoding}
        draggable={draggable}
        {...imgProps}
      />
    </picture>
  )
}

export default Picture
