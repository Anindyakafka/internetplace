"""Flatten layered SVG maps into a single optimized WebP image.

The SVGs exported from Mapbox contain 21 full-canvas PNG layers stacked
in <g> groups. This script extracts each base64 PNG, alpha-composites them
in layer order, and saves the result as a compressed WebP.
"""
import re
import base64
import io
import sys
from PIL import Image


def extract_and_flatten(svg_path: str, output_path: str, quality: int = 85, scale: float = 1.0):
    """Extract all PNG layers from an SVG and composite into one image.

    Args:
        svg_path: Path to the input SVG file.
        output_path: Path for the output WebP file.
        quality: WebP quality (0-100). 85 is visually lossless for maps.
        scale: Downscale factor (1.0 = full resolution, 0.5 = half).
    """
    print(f"\n{'='*60}")
    print(f"Processing: {svg_path}")
    print(f"{'='*60}")

    with open(svg_path, 'r', encoding='utf-8') as f:
        content = f.read()

    file_size_mb = len(content.encode('utf-8')) / 1024 / 1024
    print(f"  Input file size: {file_size_mb:.1f} MB")

    # Extract all base64 image data — handles both xlink:href and href
    pattern = r'(?:xlink:href|href)="data:image/(png|jpeg|jpg);base64,([A-Za-z0-9+/=]+)"'
    matches = re.findall(pattern, content)
    print(f"  Found {len(matches)} embedded images")

    if not matches:
        print("  ERROR: No embedded images found!")
        return None

    # Determine canvas size from first image
    first_raw = base64.b64decode(matches[0][1])
    first_img = Image.open(io.BytesIO(first_raw))
    canvas_w, canvas_h = first_img.size
    print(f"  Canvas size: {canvas_w} x {canvas_h}")

    # Create RGBA canvas
    canvas = Image.new('RGBA', (canvas_w, canvas_h), (255, 255, 255, 255))

    # Composite each layer in order
    for i, (fmt, b64_data) in enumerate(matches):
        raw = base64.b64decode(b64_data)
        layer = Image.open(io.BytesIO(raw))

        # Convert to RGBA for alpha compositing
        if layer.mode != 'RGBA':
            layer = layer.convert('RGBA')

        # Some layers might have transparency — composite with alpha
        canvas = Image.alpha_composite(canvas, layer)
        print(f"    Layer {i:2d}/{len(matches)}: {fmt.upper()} {layer.size} "
              f"({len(raw)/1024:.0f} KB) composited")

    # Apply scale if needed
    if scale < 1.0:
        new_w = int(canvas_w * scale)
        new_h = int(canvas_h * scale)
        print(f"  Downscaling to {new_w} x {new_h} ({scale*100:.0f}%)")
        canvas = canvas.resize((new_w, new_h), Image.LANCZOS)

    # Save as WebP
    canvas.save(output_path, 'WEBP', quality=quality, method=6)
    output_size = io.BytesIO()
    canvas.save(output_size, 'WEBP', quality=quality, method=6)
    out_mb = output_size.tell() / 1024 / 1024

    print(f"\n  Output: {output_path}")
    print(f"  Output size: {out_mb:.2f} MB")
    print(f"  Reduction: {file_size_mb:.1f} MB -> {out_mb:.2f} MB "
          f"({(1 - out_mb/file_size_mb)*100:.1f}% smaller)")

    return out_mb


if __name__ == '__main__':
    results = []

    # Barwani (MP) — full resolution, quality 85
    results.append(extract_and_flatten(
        'static/images/states/barwani-map.svg',
        'static/images/states/barwani-map.webp',
        quality=85,
        scale=1.0
    ))

    # West Bengal — full resolution, quality 85
    results.append(extract_and_flatten(
        'static/images/states/west_bengal.svg',
        'static/images/states/west_bengal.webp',
        quality=85,
        scale=1.0
    ))

    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    for r in results:
        if r:
            print(f"  Output: {r:.2f} MB")
    print("\nDone! Next: update image paths in +page.svelte and add preload hints.")
