export function createFullscreenQuad(device: pc.GraphicsDevice) {
    // Create the vertex format
    const vertexFormat = new pc.VertexFormat(device, [
        { semantic: pc.SEMANTIC_POSITION, components: 2, type: pc.TYPE_FLOAT32 },
    ]);

    // Create a vertex buffer
    const vertexBuffer = new pc.VertexBuffer(device, vertexFormat, 4);

    // Fill the vertex buffer
    const iterator = new pc.VertexIterator(vertexBuffer);
    iterator.element[pc.SEMANTIC_POSITION].set(-1.0, -1.0);
    iterator.next();
    iterator.element[pc.SEMANTIC_POSITION].set(1.0, -1.0);
    iterator.next();
    iterator.element[pc.SEMANTIC_POSITION].set(-1.0, 1.0);
    iterator.next();
    iterator.element[pc.SEMANTIC_POSITION].set(1.0, 1.0);
    iterator.end();

    return vertexBuffer;
}
