## Shallow First

An `h2` before any `h1` — the shape that broke an earlier sectionize
implementation, which grouped by the document's shallowest heading depth.

## Still Shallow

Second sibling at the same depth.

# Now A Top Level

This `h1` must become a sibling of the two `h2`s above, not their parent.

##### Depth Jump

Jumping from `h1` straight to `h5` should still nest.

## Back Up

Returning to `h2` must close the `h5`.

## Back Up

A duplicate heading, for slug de-duplication.

### Back Up

Same text at a different depth — the slugger does not care about level.
