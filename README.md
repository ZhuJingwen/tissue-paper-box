# TISSUE PAPER BOX
Tissue Paper Box is a project inspired by a photograph of the tissue paper box on my dinning table.

This web app interacts with the scrolling and dragging events. You could "pull" the tissue paper out through scrolling up, and you could only pull the tissue paper out, just like in real life you never put tissue paper back to the box.

You could also draw "stains" onto the tissue papers, like using them in real life.

I wish through this project, I'm not only creating a web app based on the photo, but also creating the interactive experiences inspired by the objects in the real world.

## Testing
1. Go to `tissue-paper-box` folder, start a simple HTTP server `$ python -m SimpleHTTPServer 8000`
2. Go to `localhost:8000`


## Next Steps
- Test this app through different platforms and devices, to improve the responsibility.
- Add mobile version that the tissue paper box will be replaced by a small package of tissue paper
- Add horizontal scroll function to the tissue paper box, so that users can swap boxes of tissue papers.
- Add graphical textures to the paper and create more interesting shapes of stains.
- Refine the graphic design, replace the background sag file with realtime animations.
- Comping up with more functional uses of this project, e.g. keeping notes like how people doodle on the tissue papers


## Other Thoughts
- **Library usage**

	This project was done in a fast speed, so I didn't have enough time to compare or learn different libraries. I chose [p5.js](https://p5js.org/) as the main library for canvas based illustrations and animations. However it has certain limitations. I'd like to try other libraries.

- **Paper Animations**

This project used trigonometric functions to draw the curve of the  tissue papers. I'd want to use other functions to draw the curve, and add more details to the papers' animations

- **3D**

This project will look interesting if is builded in 3D environment but rendered in a 2D graphical way
