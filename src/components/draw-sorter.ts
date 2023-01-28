export class DrawSorter extends pc.ScriptType {
    public config: {
        layer: string;
        opaque: number;
        transparent: number;
    }[] = [];

    public initialize() {
        this.updateSortMode();

        this.on("attr", () => {
            this.updateSortMode();
        });
    }

    public postInitialize(): void {}

    public update() {}

    public postUpdate(): void {}

    public swap(): void {}

    private updateSortMode() {
        for (const layerData of this.config) {
            const layer = this.app.scene.layers.getLayerByName(layerData.layer);
            if (layer) {
                layer.opaqueSortMode = layerData.opaque;
                layer.transparentSortMode = layerData.transparent;
            } else {
                console.error(`DrawSorter: Layer ${layerData.layer} not found`);
            }
        }
    }
}

pc.registerScript(DrawSorter, "drawSorter");

DrawSorter.attributes.add("config", {
    title: "Leyers",
    array: true,
    type: "json",
    schema: [
        {
            name: "layer",
            title: "Layer name",
            type: "string",
        },
        {
            name: "opaque",
            title: "Opaque Sort",
            type: "number",
            default: pc.SORTMODE_MATERIALMESH,
            enum: [
                { None: pc.SORTMODE_NONE },
                { Manual: pc.SORTMODE_MANUAL },
                { "Material Mesh": pc.SORTMODE_MATERIALMESH },
                { "Back To Front": pc.SORTMODE_BACK2FRONT },
                { "Front To Back": pc.SORTMODE_FRONT2BACK },
            ],
        },
        {
            name: "transparent",
            title: "Transparent Sort",
            type: "number",
            default: pc.SORTMODE_BACK2FRONT,
            enum: [
                { None: pc.SORTMODE_NONE },
                { Manual: pc.SORTMODE_MANUAL },
                { "Material Mesh": pc.SORTMODE_MATERIALMESH },
                { "Back To Front": pc.SORTMODE_BACK2FRONT },
                { "Front To Back": pc.SORTMODE_FRONT2BACK },
            ],
        },
    ],
});
