# Kolkata Water Log — method and provenance

This section adapts the method and interaction model of Diagram Chasing's
[BLR Water Log](https://github.com/diagram-chasing/blr-water-log), used with
permission. The reference project is MIT licensed.

## Current scope

The model covers the Kolkata metropolitan core between 88.18–88.58° E and
22.45–22.72° N. A city-scale model is preferable to a single statewide layer:
West Bengal's hills, plateau, delta, coast, rivers, embankments, and tidal
systems require different hydrological assumptions and validation.

## Terrain layer

Source DEM:

`s3://copernicus-dem-30m/Copernicus_DSM_COG_10_N22_00_E088_00_DEM/`

The reproducible script `scripts/prepare-kolkata-water-log.py`:

1. crops Copernicus GLO-30 elevation data to the study bounds;
2. fills terrain depressions using WhiteboxTools;
3. calculates D8 upstream flow accumulation;
4. log-transforms and classifies accumulation into three quantile bands; and
5. emits the transparent overlay and machine-readable metadata used by the site.

Run it with:

```powershell
python -m pip install -r scripts/requirements-kolkata-water-log.txt
python scripts/prepare-kolkata-water-log.py path/to/copernicus-dem.tif output/folder
```

## Interpretation

The map is a terrain model, not a flood forecast. A 30 m surface cannot resolve
individual kerbs, drains, culverts, buildings, sewer condition, pump operation,
rainfall intensity, Hooghly tide locking, or street-level inundation depth.

Report markers are approximate locality centroids linked to published accounts.
They are evidence that waterlogging was reported in an area, not measured flood
polygons. The next data pass should add KMC drainage networks, pumping stations,
ward boundaries, rain gauges, canal/tide observations, and independently
validated flood extents where licensing permits.
