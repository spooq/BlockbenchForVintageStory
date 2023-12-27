(function () {
    var codec;
    var import_action;
    var export_action;

    BBPlugin.register('vintagestory', {
        title: "Vintage Story",
        author: "Crabb",
        icon: "park",
        description: "Vintage Story",
        tags: ["Vintage Story"],
        version: "0.0.1",
        min_version: "4.9.2",
        variant: "both",
        await_loading: true,
        creation_date: "2023-12-22",
        onload() {
            var format = new ModelFormat('vintagestory', {
                name: 'Vintage Story Model',
                description: 'Model Format for VS specific features',
                animated_textures: false,
                animation_files: false,
                animation_mode: true,
                bone_binding_expression: false,
                bone_rig: false,
                box_uv: false,
                category: 'low_poly',
                centered_grid: true,
                display_mode: false,
                edit_mode: true,
                icon: 'park',
                image_editor: false,
                integer_size: false,
                java_face_properties: true,
                locators: true,
                meshes: true,
                model_identifier: false,
                optional_box_uv: false,
                paint_mode: true,
                parent_model_id: false,
                pose_mode: false,
                rotate_cubes: true,
                rotation_limit: false,
                select_texture_for_particles: false,
                show_on_start_screen: true,
                single_texture: false,
                target: ['Vintage Story'],
                texture_folder: true,
                texture_meshes: false,
                uv_rotation: true,
                vertex_color_ambient_occlusion: false,
            });

            codec = new Codec('vintagestory', {
                name: 'Vintage Story Block/Item Model',
                remember: true,
                extension: 'json',
                format: format,
                load_filter: {
                    type: 'json',
                    extensions: ['json'],
                    condition(model) {
                        return model.elements;
                    }
                },
                compile(options) {
                    console.log("compile")

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
                    if (Project.textures.length > 0) {
                        let TFS = "" // Texture Folder Suffix
                        let NSS = "" // Namespace Suffix

                        for (let i = 0; i < Project.textures.length; i++) {
                            if (Project.textures[i].folder) {
                                TFS = "/";
                            } else {
                                TFS = "";
                            }
                            if (Project.textures[i].namespace) {
                                NSS = ":";
                            } else {
                                NSS = "";
                            }

                            eval(`vs_model_json.textureSizes["${Project.textures[i].id}"] = [${Project.textures[i].width}, ${Project.textures[i].height}]`);
                            vs_model_json.textures[Project.textures[i].id] = Project.textures[i].namespace + NSS + Project.textures[i].folder + TFS + Project.textures[i].name.replace(".png", "");
                        }
                    }

                    //elements 
                    for (let obj of Outliner.root) {
                        createElement(vs_model_json.elements, obj);
                    }

                    function createElement(elements, obj) {
                        if (!obj.export) return;

                        if (obj.type === "cube") {
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
                                rotationX: obj.rotation[0],
                                rotationY: obj.rotation[1],
                                rotationZ: obj.rotation[2],
                            };

                            //faces
                            for (let face of faces) {
                                if (Project.textures.length > 0) {
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
                        else if (obj.type == "group") {
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
                                children: [],
                                rotationX: obj.rotation[0],
                                rotationY: obj.rotation[1],
                                rotationZ: obj.rotation[2],
                            };

                            elements.push(element);

                            for (let child of obj.children) {
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

                                                    if (kf.channel == "rotation") {
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
                },
                parse(model, path, add) {
                    console.log("parse")
                    console.log(model)
                    console.log(path)
                    console.log(add)

                    //newProject(Formats.format)
                }
            });

            format.codec = codec;

            import_action = new Action('import_vsmodel', {
                id: "import_vintagestory",
                name: 'Import Vintage Story Shape',
                icon: 'park',
                category: 'file',
                click() {
                    Blockbench.import({
                        extensions: ['json'],
                        type: 'Vintage Story Shape',
                        readtype: 'text',
                        resource_id: 'vintagestory_files'
                    }, files => {
                        vsname = files[0].name.replace(".json", "");
                        Project.name = vsname;
                        Project.model_identifier = vsname;
                        codec.parse(files[0].content, files[0]);
                    })
                }
            })

            export_action = new Action('export_vsmodel', {
                id: "export_vintagestory",
                name: 'Export Vintage Story Shape',
                icon: 'park',
                category: 'file',
                condition: () => { return Format.id == format.id },
                click() {
                    //codec.export();
                    Blockbench.export({
                        resource_id: 'vintagestory_files',
                        type: 'Vintage Story Shape',
                        extensions: ['json'],
                        name: 'animation',
                        content: content,
                        savetype: 'text'
                    });
                }
            });

            MenuBar.addAction(import_action, 'file.import');
            MenuBar.addAction(export_action, 'file.export');
        },
        onunload() {
            codec.format.delete();
            codec.delete();
            import_action.delete()
            export_action.delete()
        }
    })
})()
