# Description

The repo contains the next Typescript ScriptComponents for [Playcanvas](https://playcanvas.com/):

- **overdraw**. It is used to visualize pixel overdraw. Color of pixel measures the number of times a pixel is drawn on top of itself. The more red a pixel is, the more overdraw it has. The more overdraw a pixel has, the more work the GPU has to do to draw it.
- **draw-sorter**. It is used to change sorting method in the scene based on distance of objects to the camera. It is used to reduce pixel overdraw.

The repo is based on the [Playcanvas TypeScript Template](https://github.com/querielo/playcanvas-typescript-template). I highly recommend you to check it out. Read more about usage of Playcanvas Overdraw in the Playcanvas TypeScript Template.

# Pixel Overdraw

Pixel overdraw refers to the number of times a pixel is drawn on top of itself. Keeping pixel overdraw as low as possible is important for several reasons:

1. **Performance**: Overdraw can greatly slow down the performance of a game or application, as it requires the GPU to do more work.
2. **Battery life**: Overdraw can also have a significant impact on battery life, as it requires more power to draw more pixels.
3. **Quality**: Overdraw can also lead to visual artifacts, such as flickering or aliasing, which can negatively impact the visual quality of the game or application.


To reduce pixel overdraw, it is important to make sure that objects in the scene are properly sorted, and that objects that are obscured by others are not drawn. Additionally, techniques such as culling and occlusion can be used to further reduce the number of pixels that need to be drawn.

# Notice

README.md has been written with ChatGPT.
