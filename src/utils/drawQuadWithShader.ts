const _tempRect = new pc.Vec4();

/**
 * Draws a screen-space quad using a specific shader.
 *
 * @param {import('../../platform/graphics/graphics-device.js').GraphicsDevice} device - The graphics device used to draw
 * the quad.
 * @param {import('../../platform/graphics/render-target.js').RenderTarget|undefined} target - The destination render
 * target. If undefined, target is the frame buffer.
 * @param {import('../../platform/graphics/shader.js').Shader} shader - The shader used for rendering the quad. Vertex
 * shader should contain `attribute vec2 vertex_position`.
 * @param {import('../../core/math/vec4.js').Vec4} [rect] - The viewport rectangle of the quad, in
 * pixels. Defaults to fullscreen (`0, 0, target.width, target.height`).
 * @param {import('../../core/math/vec4.js').Vec4} [scissorRect] - The scissor rectangle of the
 * quad, in pixels. Defaults to fullscreen (`0, 0, target.width, target.height`).
 */
export function drawQuadWithShader(
    device: pc.GraphicsDevice,
    target: pc.RenderTarget,
    shader: pc.Shader,
    rect?: pc.Vec4,
    scissorRect?: pc.Vec4
) {
    device.setCullMode(pc.CULLFACE_NONE);
    device.setDepthState(pc.DepthState.NODEPTH);
    // device.setStencilState(null, null);

    // prepare the quad for rendering with the shader
    const quad = new pc.QuadRender(shader);

    // by default render to the whole render target
    if (!rect) {
        rect = _tempRect;
        rect.x = 0;
        rect.y = 0;
        rect.z = target ? target.width : device.width;
        rect.w = target ? target.height : device.height;
    }

    quad.render(rect, scissorRect);

    quad.destroy();
}
