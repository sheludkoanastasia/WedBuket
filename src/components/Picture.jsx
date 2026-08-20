/**
 * WebP с запасным PNG/JPG/SVG. Оригиналы не удаляем.
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
