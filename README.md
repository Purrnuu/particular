# Particular

An opinionated Particle Engine.

## Install

Install with npm or yarn. Then live .

## Usage (With React)

To import the HOC wrapper for React

```
import { ParticularWrapper } from "particular";
```

```
ParticularWrapper({
  customIcons: Array of images,
  rate: Integer emission rate (How many particles per burst iteration),
  life: Integer emitter amount (How many particles per burst),
  maxCount: Integer for maximum amount of concurrent particles,
})(ReactComponent)
```

## Usage (Pure)

To import the Particular library itself

```
import { Particular } from "particular";
```

No documentation support yet. You need to check the source code for now.
Look into CanvasWrapper for details.

## Tips

There are various ways to do particles. This is one.
