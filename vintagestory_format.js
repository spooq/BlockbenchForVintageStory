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
					console.log("load vintagestory_format")
				}
			}
			
			let format = new ModelFormat('vintagestory', {
				animated_textures: false,
				animation_files: false,
				animation_mode: true,
				bone_binding_expression: false,
				bone_rig: false,
				box_uv: false,
				category: 'low_poly',
				centered_grid: true,
				description: 'Model for Vintage Story.',
				display_mode: false,
				edit_mode: true,
				icon: 'park',
				image_editor: false,
				integer_size: false,
				java_face_properties: true,
				locators: true,
				meshes: true,
				model_identifier: false,
				name: 'Vintage Story Model',
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
			})
		},
		onunload() {
			console.log("unload vintagestory_format");
		}
	})
})()
