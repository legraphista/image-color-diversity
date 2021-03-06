# Image Color Diversity

Basic CLI tool to calculate the color diversity of an image

## Install
```
npm i -g image-color-diversity
```

## Usage
```
diversity [<file>] [-c <CONTRAST VALUE> -h -o <OUTPUT FILE>]

    -c : Contrast value ranging from -255 to 255
    -h : human readable color index output
    -o : output processed image to location

Examples:

diversity test.png -h -c 255
cat test.png | diversity -h -c 255
```

### Example Output

The output is a JSON array.

Each item is an array containing:
 - 0: color index
 - 1: pixel count for the color index
 - 2: percentage of the image covered by the color index

Without -h flag
```
   [ [ '16777215', 803331, 0.871669921875 ],
     [ '0', 78899, 0.08561089409722222 ],
     [ '255', 20825, 0.022596571180555556 ],
     [ '65535', 15914, 0.01726779513888889 ],
     [ '16711935', 1098, 0.00119140625 ],
     [ '8454143', 592, 0.0006423611111111111 ],
     [ '33023', 480, 0.0005208333333333333 ],
     [ '128', 357, 0.00038736979166666667 ],
     [ '8421504', 47, 0.00005099826388888889 ],
     [ '8388863', 36, 0.0000390625 ],
     [ '16744703', 14, 0.000015190972222222222 ],
     [ '32896', 3, 0.0000032552083333333335 ],
     [ '16711680', 3, 0.0000032552083333333335 ],
     [ '65408', 1, 0.0000010850694444444444 ] ]
```

With -h flag:
```
[ [ 'R255 G255 B255', 803331, 0.871669921875 ],
  [ 'R0 G0 B0', 78899, 0.08561089409722222 ],
  [ 'R255 G0 B0', 20825, 0.022596571180555556 ],
  [ 'R255 G255 B0', 15914, 0.01726779513888889 ],
  [ 'R255 G0 B255', 1098, 0.00119140625 ],
  [ 'R255 G255 B128', 592, 0.0006423611111111111 ],
  [ 'R255 G128 B0', 480, 0.0005208333333333333 ],
  [ 'R128 G0 B0', 357, 0.00038736979166666667 ],
  [ 'R128 G128 B128', 47, 0.00005099826388888889 ],
  [ 'R255 G0 B128', 36, 0.0000390625 ],
  [ 'R255 G128 B255', 14, 0.000015190972222222222 ],
  [ 'R128 G128 B0', 3, 0.0000032552083333333335 ],
  [ 'R0 G0 B255', 3, 0.0000032552083333333335 ],
  [ 'R128 G255 B0', 1, 0.0000010850694444444444 ] ]
```