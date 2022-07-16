(function () {
    let exportVsAction;
    let importVsAction;

    Plugin.register('vintagestory_models', {
        title: 'Vintage Story Models',
        icon: 'park',
        author: 'Malik12tree',
        description: 'Import/export VintageStory models.',
        version: '1.0.0',
        variant: "both",
        onload() {
            exportVsAction = new Action("exportVsModel", {
                name: "Export Vintage Story Model",
                icon: "park",
                click: function () {
                    const axis = ["x", "y", "z"];
                    const faces = ["north", "east", "south", "west", "up", "down",];
                    const channels = ["rotation", "position", "scale"];
                    const world_center = Format.name === "Java Block/Item" ? 0 : 8;

                    let vs_model_json = {
                        textureWidth: Project.texture_width,
                        textureHeight: Project.texture_height,
                        textureSizes: {},
                        textures: {},
                        elements: [],
                        animations: []
                    };

                    //textures
                    if (Project.textures.length > 0) 
                    {
                        for (let i = 0; i < Project.textures.length; i++) 
                        {
                            eval(`vs_model_json.textureSizes["${Project.textures[i].id}"] = [${Project.textures[i].width}, ${Project.textures[i].height}]`);

                            if (Blockbench.operating_system == "Windows") 
                            {
                                // remove Drive name
                                vs_model_json.textures[Project.textures[i].id] = Project.textures[i].path.substring(2).replace(".png", "").replaceAll("\\", "/");
                            } else {
                                vs_model_json.textures[Project.textures[i].id] = Project.textures[i].path.replace(".png", "").replaceAll("\\", "/").replaceAll("\/", "/");
                            }
                        }
                    }

                    //elements 
                    for (let obj of Outliner.root)
                    {
                        createElement(vs_model_json.elements, obj);
                    }

                    function createElement(elements, obj) 
                    {
                        if (!obj.export) return;

                        if (obj.type === "cube")
                        {
                            let element = {
                                name: obj.name,
                                from: [obj.from[0] + world_center, obj.from[1], obj.from[2] + world_center],
                                to: [obj.to[0] + world_center, obj.to[1], obj.to[2] + world_center],
                                rotationOrigin: [obj.origin[0] + world_center, obj.origin[1], obj.origin[2] + world_center],
                                faces: {
                                    north: { texture: "#0", uv: [0, 0, 0, 0] },
                                    east: { texture: "#0", uv: [0, 0, 0, 0] },
                                    south: { texture: "#0", uv: [0, 0, 0, 0] },
                                    west: { texture: "#0", uv: [0, 0, 0, 0] },
                                    up: { texture: "#0", uv: [0, 0, 0, 0] },
                                    down: { texture: "#0", uv: [0, 0, 0, 0] }
                                },
                                parent: obj.parent === "root" ? null : obj.parent.name,
                                rotationX: obj.rotation[0],
                                rotationY: obj.rotation[1],
                                rotationZ: obj.rotation[2],
                            };

                            //faces
                            for (let face of faces) 
                            {
                                if (Project.textures.length > 0) 
                                {
                                    if (!Format.single_texture) {
                                        if (Project.textures.find(e => e.uuid == obj.faces[face].texture) !== false) {
                                            element.faces[face].texture = "#" + Project.textures.find(e => e.uuid == obj.faces[face].texture).id;
                                        } else {
                                            element.faces[face].texture = "#missing";
                                        }

                                    } else {
                                        element.faces[face].texture = "#" + obj.faces[face].getTexture().id;
                                    }
                                }

                                element.faces[face].autoUv = Project.box_uv;
                                element.faces[face].uv = [obj.faces[face].uv[0], obj.faces[face].uv[1], obj.faces[face].uv[2], obj.faces[face].uv[3]];

                                if (obj.faces[face].rotation !== 0) {
                                    element.faces[face].rotation = obj.faces[face].rotation;
                                }
                            };

                            elements.push(element);
                        }
                        else if (obj.type == "group")
                        {
                            let element = {
                                name: obj.name,
                                from: [0, 0, 0],
                                to: [0, 0, 0],
                                rotationOrigin: [obj.origin[0] + world_center, obj.origin[1], obj.origin[2] + world_center],
                                faces: {
                                    north: { texture: "#0", uv: [0, 0, 0, 0] },
                                    east: { texture: "#0", uv: [0, 0, 0, 0] },
                                    south: { texture: "#0", uv: [0, 0, 0, 0] },
                                    west: { texture: "#0", uv: [0, 0, 0, 0] },
                                    up: { texture: "#0", uv: [0, 0, 0, 0] },
                                    down: { texture: "#0", uv: [0, 0, 0, 0] }
                                },
                                parent: obj.parent === "root" ? null : obj.parent.name,
                                children: [],
                                rotationX: obj.rotation[0],
                                rotationY: obj.rotation[1],
                                rotationZ: obj.rotation[2],
                            };

                            elements.push(element);

                            for (let child of obj.children)
                            {
                                createElement(element.children, child);
                            }
                        }
                    }

                    //Animation
                    if (Format.animation_mode) {
                        for (let i = 0; i < Animation.all.length; i++) {
                            let animation = Animation.all[i];

                            const snap_time = (1 / Math.clamp(animation.snapping, 1, 120)).toFixed(4) * 1;

                            let animators = []
                            Object.keys(animation.animators).forEach(key => {
                                animators.push(animation.animators[key]);
                            });
                            let anim = {
                                name: animation.name,
                                code: (animation.name).toLowerCase().replace(" ", "_"),
                                onActivityStopped: "EaseOut",
                                onAnimationEnd: "Repeat",
                                quantityframes: (animation.length * 30).toFixed() * 1,
                                keyframes: [
                                ],
                            }

                            // loop mode
                            if (animation.loop === "hold") {
                                anim.onAnimationEnd = "Hold"
                            } else if (animation.loop === "once") {
                                anim.onAnimationEnd = "Stop"
                            }

                            animators.forEach(animator => {
                                // keyframes
                                //gather
                                let newKfs = [];

                                channels.forEach(channel => {
                                    if (animator.group !== undefined && animator[channel].length > 0) {
                                        var keyframes_sorted = animator[channel].slice().sort((a, b) => a.time - b.time);
                                        for (let k = 0; k <= keyframes_sorted.last().time + 0.5; k += snap_time) {
                                            const timeIndex = Math.trunc(k * 10000) / 10000;

                                            //target kf
                                            const findingKF = animator[channel].find(kf => getRangeBool(kf.time, timeIndex - .02, timeIndex + .02));
                                            if (findingKF !== undefined) {
                                                const tIndex = newKfs.findIndex(e => e.find(f => f.time == findingKF.time));

                                                if (tIndex !== -1) {
                                                    newKfs[tIndex].push(findingKF);
                                                } else {
                                                    newKfs.push([findingKF]);
                                                }
                                            }
                                        }
                                    }
                                });

                                newKfs.forEach((frame, indexf) => {
                                    let keyframe = {
                                        frame: ((frame[0].time * 29).toFixed() * 1),
                                        elements: {
                                        }
                                    }
                                    const groupC = [animator.group]

                                    for (let g = 0; g < groupC.length; g++) {
                                        let elemA = {};

                                        if (animator.keyframes.length > 0) {
                                            frame.forEach(kf => {
                                                axis.forEach(a => {
                                                    elemA[kf.channel.replace("position", "offset").replace("scale", "stretch") + a.toUpperCase()] = kf.data_points[0][a] * 1;

                                                    if (kf.channel == "rotation")
                                                    {
                                                        elemA[kf.channel.replace("position", "offset").replace("scale", "stretch") + a.toUpperCase()] = -elemA[kf.channel.replace("position", "offset").replace("scale", "stretch") + a.toUpperCase()];
                                                    }
                                                });
                                            });
                                            // 30 is fps VS uses for anims
                                            if (anim.keyframes.find(e => e.frame === (frame[0].time * 29).toFixed() * 1) !== undefined) {
                                                anim.keyframes.find(e => e.frame === (frame[0].time * 29).toFixed() * 1).elements[groupC[g].name] = elemA;
                                            } else {
                                                keyframe.elements[groupC[g].name] = elemA;
                                            }
                                        }
                                    }
                                    if (anim.keyframes.find(e => e.frame === (frame[0].time * 29).toFixed() * 1) === undefined) {
                                        anim.keyframes.push(keyframe);
                                    }
                                });
                            });

                            anim.keyframes.sort((a, b) => a.frame - b.frame);
                            vs_model_json.animations.push(anim);
                        }
                    }

                    Blockbench.export({
                        type: 'VintageStory Model',
                        extensions: ['json'],
                        name: (Project.name !== '' ? Project.name : "model"),
                        content: autoStringify(vs_model_json),
                        savetype: 'json'
                    });
                }
            });

            importVsAction = new Action("importVsModel", {
                name: "Import Vintage Story Model",
                icon: "park",
                click: function () {
                    const world_center = Format.name === "Java Block/Item" ? 0 : 8;

					Blockbench.import({
						extensions: ['json'],
						type: 'Vintage Story Model',
						readtype: 'text',
					}, (files) => {
		                Undo.initEdit({"elements": [], "uv_only": false, "textures": []});

                        let root_group = new Group({
                            name: files[0].name
                        }).init().addTo();

                        for (let file of files)
                        {
                            let json = JSON.parse(file.content); 

                            console.log(json);

                            for (let element of json.elements)
                            {
                                parseElement(element, root_group);
                            }

                            function parseElement(element, group) 
                            {         
                                let origin = [element.rotationOrigin[0] - world_center, element.rotationOrigin[1], element.rotationOrigin[2] - world_center];
                                let rotation = [
                                    element.rotationX == undefined ? 0 : element.rotationX, 
                                    element.rotationY == undefined ? 0 : element.rotationY, 
                                    element.rotationZ == undefined ? 0 : element.rotationZ
                                ];
                                let from = [element.from[0] - world_center, element.from[1], element.from[2] - world_center];
                                let to = [element.to[0] - world_center, element.to[1], element.to[2] - world_center];
                                
                                if (
                                    element.children != undefined && 
                                    element.children != null && 
                                    element.children.length > 0
                                )
                                {
                                    let new_group = new Group().extend({
                                        name: element.name,
                                        origin: origin,
                                        rotation: rotation
                                    }).init().addTo(group);

                                    if (!(
                                        element.from[0] == 0 && element.from[1] == 0 && element.from[2] == 0 &&
                                        element.to[0] == 0 && element.to[1] == 0 && element.to[2] == 0
                                    ))
                                    {
                                        let new_cube = new Cube({
                                            name: element.name,
                                            // from: [from[0] - origin[0], from[1] - origin[1], from[2] - origin[2]],
                                            // to: [to[0] - origin[0], to[1] - origin[1], to[2] - origin[2]]   
                                            from: from,
                                            to: to,
                                            origin: origin,
                                            rotation: rotation,
                                        }).init().addTo(group);
                                    }

                                    for (let child_element of element.children)
                                    {
                                        parseElement(child_element, new_group);
                                    }
                                }
                                else 
                                {
                                    let new_cube = new Cube({
                                        name: element.name,
                                        from: from,
                                        to: to,
                                        origin: origin,
                                        rotation: rotation
                                    }).init().addTo(group);
                                }
                            }
                        }

		                Undo.finishEdit("vsimporter", { "elements": root_group.children, "uv_only": false, "textures": []});
		                Canvas.updateAll();
					});
                }                
            });

            MenuBar.addAction(exportVsAction, "file.export");
            MenuBar.addAction(importVsAction, "file.import");
        },
        onunload() {
            exportVsAction.delete();
            importVsAction.delete();
        }
    });

    function getRangeBool(x, min, max) {
        return x >= min && x <= max;
    }

    function list_to_tree(list) {
        let map = {};
        let roots = [];

        for (let i = 0; i < list.length; i++) 
        {
            map[list[i].name] = i;
            list[i].children = [];
        }

        for (let i = 0; i < list.length; i++) 
        {
            let node = list[i];

            if (node.parent !== null) 
            {
                console.log("parent: " + node.parent);
                console.log("parent_obj: " + list[map[node.parent]]);

                if (list[map[node.parent]] !== undefined)
                {
                    list[map[node.parent]].children.push(node);
                }
            } 
            else 
            {
                roots.push(node);
            }
        }
        return roots;
    }
})()