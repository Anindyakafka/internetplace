#!/usr/bin/env python3
"""Recover classified water polygons from the deployed Kolkata RGBA raster.

The original DEM products are not stored in the repository, but the PNG keeps
the three classification colours. Polygonising those classes restores the
vector fill rendering used by Diagram Chasing's BLR Water Log.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import rasterio
from rasterio.features import shapes
from rasterio.transform import from_bounds
from shapely.geometry import mapping, shape

BOUNDS = (88.18, 22.45, 88.58, 22.72)
COLOURS = {
	(196, 205, 208): 1,
	(171, 206, 208): 2,
	(81, 158, 162): 3,
}


def rounded(value):
	if isinstance(value, (list, tuple)):
		return [rounded(item) for item in value]
	if isinstance(value, float):
		return round(value, 6)
	return value


def main(source: Path, destination: Path) -> None:
	with rasterio.open(source) as dataset:
		rgba = dataset.read()
	if rgba.shape[0] < 3:
		raise ValueError("Expected an RGB or RGBA classified image")

	classified = np.zeros((rgba.shape[1], rgba.shape[2]), dtype="uint8")
	for colour, value in COLOURS.items():
		mask = np.all(rgba[:3] == np.asarray(colour)[:, None, None], axis=0)
		classified[mask] = value

	transform = from_bounds(*BOUNDS, classified.shape[1], classified.shape[0])
	pixel_area = ((BOUNDS[2] - BOUNDS[0]) / classified.shape[1]) * ((BOUNDS[3] - BOUNDS[1]) / classified.shape[0])
	minimum_area = {1: pixel_area * 12, 2: pixel_area * 3, 3: pixel_area}
	features = []
	for geometry, value in shapes(classified, mask=classified > 0, transform=transform):
		polygon = shape(geometry).simplify(0.000035, preserve_topology=True)
		value = int(value)
		# Remove isolated low-accumulation speckles while retaining every strong
		# channel. This mirrors tippecanoe's density dropping in the BLR build.
		if polygon.is_empty or polygon.area < minimum_area[value]:
			continue
		features.append({
			"type": "Feature",
			"properties": {"VALUE": value},
			"geometry": rounded(mapping(polygon)),
		})

	destination.parent.mkdir(parents=True, exist_ok=True)
	destination.write_text(
		json.dumps({"type": "FeatureCollection", "features": features}, separators=(",", ":")),
		encoding="utf-8",
	)
	print(f"Wrote {len(features):,} polygons to {destination} ({destination.stat().st_size / 1_000_000:.1f} MB)")


if __name__ == "__main__":
	if len(sys.argv) != 3:
		raise SystemExit("usage: vectorize-kolkata-water-log.py INPUT.png OUTPUT.geojson")
	main(Path(sys.argv[1]), Path(sys.argv[2]))
