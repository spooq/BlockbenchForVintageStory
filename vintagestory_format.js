(function () {
    BBPlugin.register('vintagestory_format', {
        title: "Vintage Story Model Format",
        author: "Crabb",
        icon: "park",
        description: "Optimised model format for Vintage Story.",
        tags: ["Vintage Story"],
        version: "0.0.1",
        min_version: "4.9.2",
        variant: "both",
        await_loading: true,
        creation_date: "2023-12-22",
        onload() {
            console.log("load vintagestory_format")

            var codec = new Codec('vintagestory', {
                name: 'Vintage Story Block/Item Model',
                remember: true,
                extension: 'json',
                load_filter: {
                    type: 'json',
                    extensions: ['json'],
                    condition(model) {
                        return model.elements;
                    }
                },
                compile(options) {
                    console.log("compile")
                },
                parse(model, path, add) {
                    console.log("parse")
                }
            });
        };
        onunload() {
            console.log("unload vintagestory_format");
        }
    })
})()
