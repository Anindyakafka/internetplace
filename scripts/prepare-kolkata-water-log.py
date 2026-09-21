#!/usr/bin/env python3
"""Build the Kolkata Water Log terrain overlay from a Copernicus GLO-30 DEM.

Method adapted from Diagram Chasing's MIT-licensed BLR Water Log pipeline:
https://github.com/diagram-chasing/blr-water-log

Dependencies: rasterio, numpy, whitebox
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import rasterio
from rasterio.windows import from_bounds
from whitebox import WhiteboxTools

BOUNDS = (88.18, 22.45, 88.58, 22.72)  # west, south, east, north


def crop_dem(source: Path, target: Path) -> None:
	with rasterio.open(source) as src:
		window = from_bounds(*BOUNDS, transform=src.transform).round_offsets().round_lengths()
		profile = src.profile.copy()
		profile.update(
			height=int(window.height),
			width=int(window.width),
			transform=src.window_transform(window),
			compress="deflate",
		)
		with rasterio.open(target, "w", **profile) as dst:
			dst.write(src.read(window=window))


def classify(flow_path: Path, output_path: Path, image_path: Path, metadata_path: Path) -> None:
	with rasterio.open(flow_path) as src:
		flow = src.read(1, masked=True).astype("float64")
		valid = np.asarray(flow.compressed())
		valid = valid[np.isfinite(valid) & (valid > 0)]
		logged = np.log1p(valid)
		breaks = np.quantile(logged, [0.78, 0.90, 0.97])
		all_logged = np.log1p(np.maximum(flow.filled(0), 0))
		classes = np.zeros(flow.shape, dtype="uint8")
		classes[all_logged >= breaks[0]] = 1
		classes[all_logged >= breaks[1]] = 2
		classes[all_logged >= breaks[2]] = 3
		classes[np.asarray(flow.mask)] = 0

		profile = src.profile.copy()
		profile.update(dtype="uint8", count=1, nodata=0, compress="deflate")
		with rasterio.open(output_path, "w", **profile) as dst:
			dst.write(classes, 1)

		rgba = np.zeros((4, classes.shape[0], classes.shape[1]), dtype="uint8")
		palette = {
			1: (196, 205, 208, 55),
			2: (171, 206, 208, 135),
			3: (81, 158, 162, 215),
		}
		for value, color in palette.items():
			mask = classes == value
			for band, channel in enumerate(color):
				rgba[band][mask] = channel
		with rasterio.open(
			image_path,
			"w",
			driver="PNG",
			height=classes.shape[0],
			width=classes.shape[1],
			count=4,
			dtype="uint8",
		) as dst:
			dst.write(rgba)

	metadata_path.write_text(
		json.dumps(
			{
				"bounds": {"west": BOUNDS[0], "south": BOUNDS[1], "east": BOUNDS[2], "north": BOUNDS[3]},
				"classes": 3,
				"quantiles": [0.78, 0.90, 0.97],
				"source": "Copernicus DEM GLO-30",
				"method": "Filled-depression D8 flow accumulation, log transformed and quantile classified",
			},
			indent=2,
		),
		encoding="utf-8",
	)


def main() -> None:
	parser = argparse.ArgumentParser()
	parser.add_argument("dem", type=Path, help="Copernicus GLO-30 GeoTIFF containing Kolkata")
	parser.add_argument("output", type=Path, help="Output directory")
	args = parser.parse_args()
	args.output.mkdir(parents=True, exist_ok=True)

	cropped = args.output / "kolkata-dem.tif"
	filled = args.output / "kolkata-dem-filled.tif"
	flow = args.output / "kolkata-flow-accumulation.tif"
	classified = args.output / "kolkata-water-accumulation.tif"
	image = args.output / "kolkata-water-accumulation.png"

	crop_dem(args.dem.resolve(), cropped)
	wbt = WhiteboxTools()
	wbt.set_working_dir(str(args.output.resolve()))
	wbt.fill_depressions(str(cropped.resolve()), str(filled.resolve()))
	wbt.d8_flow_accumulation(str(filled.resolve()), str(flow.resolve()), out_type="cells")
	classify(flow, classified, image, args.output / "kolkata-water-log.json")
	print(image)


if __name__ == "__main__":
	main()
