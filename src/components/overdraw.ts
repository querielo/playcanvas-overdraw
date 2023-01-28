import { createFullscreenQuad } from "../utils/createFullscreenQuad";

const COLORS = [
    new Float32Array([43 / 255, 0 / 255, 255 / 255, 1]),
    new Float32Array([0 / 255, 85 / 255, 255 / 255, 1]),
    new Float32Array([0 / 255, 213 / 255, 255 / 255, 1]),
    new Float32Array([0 / 255, 255 / 255, 170 / 255, 1]),
    new Float32Array([0 / 255, 255 / 255, 42 / 255, 1]),
    new Float32Array([128 / 255, 255 / 255, 0 / 255, 1]),
    new Float32Array([255 / 255, 213 / 255, 0 / 255, 1]),
    new Float32Array([255 / 255, 0 / 255, 0 / 255, 1]),
    new Float32Array([0, 0, 0, 1]),
];

export class Overdraw extends pc.ScriptType {
    public layers: string[] = [];

    private isActive = false;

    private shader!: pc.Shader;
    private vertexBuffer!: pc.VertexBuffer;

    public initialize() {
        const graphicsDevice = pc.app.graphicsDevice;

        this.vertexBuffer = createFullscreenQuad(graphicsDevice);

        this.shader = new pc.Shader(graphicsDevice, {
            attributes: {
                aPosition: pc.SEMANTIC_POSITION,
            },
            vshader: `
attribute vec2 aPosition;

void main(void)
{
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`,
            fshader: `
precision ${graphicsDevice.precision} float;

uniform vec4 uColor;

void main(void)
{
    gl_FragColor = vec4(uColor.xyz, 1.);
}
`,
        });

        for (const layerName of this.layers) {
            const layer = this.app.scene.layers.getLayerByName(layerName);
            if (layer) {
                this.prepareLayer(layer);
            }
        }

        this.on("attr", () => {
            for (const layer of this.app.scene.layers.layerList) {
                layer.onPreRender = () => {};
                layer.onPostRender = () => {};
            }

            for (const layerName of this.layers) {
                const layer = this.app.scene.layers.getLayerByName(layerName);
                if (layer) {
                    this.prepareLayer(layer);
                }
            }
        });
    }

    public postInitialize(): void {}

    public update() {
        this.isActive = this.app.keyboard.isPressed(pc.KEY_V);
    }

    public postUpdate(): void {}

    public swap(): void {
        this.initialize();
    }

    private prepareLayer(layer: pc.Layer) {
        const graphicsDevice = pc.app.graphicsDevice;

        const stencil = new pc.StencilParameters({
            zpass: pc.STENCILOP_INCREMENT,
        });

        const materialToStencil = new Map<
            pc.Material,
            [pc.StencilParameters, pc.StencilParameters]
        >();

        layer.onPreRender = () => {
            if (!this.isActive) {
                return;
            }

            // @ts-ignore
            const listInstances = layer.instances;

            for (const instanceList of [
                listInstances.transparentMeshInstances,
                listInstances.opaqueMeshInstances,
            ]) {
                for (const instance of instanceList) {
                    const material = instance.material;
                    materialToStencil.set(material, [
                        material.stencilBack,
                        material.stencilFront,
                    ]);

                    material.stencilBack = material.stencilFront = stencil;
                }
            }
        };

        layer.onPostRender = () => {
            if (!this.isActive) {
                return;
            }

            for (const [
                material,
                [stencilBack, stencilFront],
            ] of materialToStencil) {
                material.stencilBack = stencilBack;
                material.stencilFront = stencilFront;
            }

            materialToStencil.clear();

            for (let i = 0; i < COLORS.length; ++i) {
                const color = COLORS[i];

                graphicsDevice.scope.resolve("uColor").setValue(color);

                graphicsDevice.setStencilTest(true);
                if (i === COLORS.length - 1) {
                    graphicsDevice.setStencilFunc(
                        pc.FUNC_LESSEQUAL,
                        i + 1,
                        0xffffff
                    );
                } else {
                    graphicsDevice.setStencilFunc(
                        pc.FUNC_EQUAL,
                        i + 1,
                        0xffffff
                    );
                }
                graphicsDevice.setStencilOperation(
                    pc.STENCILOP_KEEP,
                    pc.STENCILOP_KEEP,
                    pc.STENCILOP_KEEP,
                    0xffffff
                );

                pc.drawFullscreenQuad(
                    graphicsDevice,
                    graphicsDevice.getRenderTarget(),
                    this.vertexBuffer,
                    this.shader
                );
            }
        };
    }
}

// register the class as a script
pc.registerScript(Overdraw, "overdraw");

// declare script attributes (Must be after pc.registerScript())
Overdraw.attributes.add("layers", {
    type: "string",
    array: true,
    default: ["World"],
});
