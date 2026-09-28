/**
 * DingLogo 3D — dependency-free WebGL 2 viewer for the included ding-logo.glb.
 * All graphics are taken from DingLogo.svg. Only the logo's model matrix changes.
 * This is a deliberately small loader for this asset, not a general-purpose GLTF viewer.
 * Browser-only: imported from the processed <script> in DingLogo3D.astro.
 */
const TAG = "ding-logo-3d";
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const rad = (degrees) => (degrees * Math.PI) / 180;
const HOVER_YAW = rad(6);
const HOVER_PITCH = rad(5);

const VERTEX = `#version 300 es
in vec3 aPosition;
in vec3 aNormal;
in vec2 aUV;
uniform mat4 uModel;
uniform mat3 uNormal;
uniform vec2 uView;
out vec2 vUV;
out vec3 vNormal;
out vec3 vPosition;
void main() {
  vec4 p = uModel * vec4(aPosition, 1.0);
  gl_Position = vec4(2.0 * p.x / uView.x, 2.0 * p.y / uView.y, -p.z / 2.0, 1.0);
  vPosition = p.xyz;
  vUV = aUV;
  vNormal = normalize(uNormal * aNormal);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D uTexture;
uniform bool uTextured;
uniform vec2 uLight;
uniform float uLightStrength;
in vec2 vUV;
in vec3 vNormal;
in vec3 vPosition;
out vec4 fragColor;
void main() {
  vec3 n = normalize(vNormal);
  vec2 delta = uLight - vPosition.xy;
  vec3 pointerLight = normalize(vec3(delta, 0.65));
  vec3 key = normalize(mix(vec3(-0.65, 0.85, 1.3), vec3(delta, 0.65), uLightStrength));
  vec3 halfLight = normalize(pointerLight + vec3(0.0, 0.0, 1.0));
  float spot = exp(-dot(delta, delta) / 0.055);
  float gloss = pow(max(dot(n, halfLight), 0.0), 24.0);
  if (uTextured) {
    vec4 ink = texture(uTexture, vUV);
    if (ink.a < 0.015) discard;
    // Illuminate the painted face too, with a broad moving reflection inside its alpha mask.
    vec3 lit = ink.rgb * (0.90 + 0.10 * max(dot(n, pointerLight), 0.0));
    lit = mix(lit, vec3(0.93, 0.96, 1.0), spot * (0.12 + 0.20 * gloss));
    vec3 color = mix(ink.rgb, lit, uLightStrength);
    fragColor = vec4(color * ink.a, ink.a);
  } else {
    vec3 rim = normalize(vec3(1.0, 0.2, 0.45));
    float diffuse = 0.48 + 0.64 * max(dot(n, key), 0.0) + 0.24 * max(dot(n, rim), 0.0);
    float specular = pow(max(dot(n, normalize(key + vec3(0.0, 0.0, 1.0))), 0.0), 38.0) * 0.13;
    vec3 edge = vec3(0.18, 0.193, 0.205) * diffuse + specular;
    edge += vec3(0.12, 0.14, 0.17) * spot * gloss * uLightStrength;
    fragColor = vec4(edge, 1.0);
  }
}`;

/** Validate the asset and return its embedded JSON and binary chunk. */
function parseGLB(buffer) {
	if (!(buffer instanceof ArrayBuffer) || buffer.byteLength < 20)
		throw new Error("Ugyldig modellfil.");
	const view = new DataView(buffer);
	if (view.getUint32(0, true) !== 0x46546c67 || view.getUint32(4, true) !== 2)
		throw new Error("Forventet GLB 2.0.");
	if (view.getUint32(8, true) !== buffer.byteLength)
		throw new Error("Modellfilen er ufullstendig.");
	let json, binary;
	for (let offset = 12; offset + 8 <= buffer.byteLength;) {
		const length = view.getUint32(offset, true),
			type = view.getUint32(offset + 4, true);
		const start = offset + 8;
		if (start + length > buffer.byteLength) throw new Error("Ugyldig GLB-datalengde.");
		if (type === 0x4e4f534a)
			json = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, start, length)));
		if (type === 0x004e4942) binary = new Uint8Array(buffer, start, length);
		offset = start + length;
	}
	if (!json?.meshes?.[0]?.primitives || !binary || !json.nodes?.[0]?.extras?.pivotSvg)
		throw new Error("Modellen mangler DingLogo-metadata.");
	return { json, binary, meta: json.nodes[0].extras };
}

function decodeImage(blob, signal) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(blob),
			img = new Image();
		const finish = (error) => {
			URL.revokeObjectURL(url);
			signal.removeEventListener("abort", cancel);
			img.onload = img.onerror = null;
			if (error) reject(error);
			else resolve(img);
		};
		const cancel = () => finish(new DOMException("Aborted", "AbortError"));
		img.onload = () => finish();
		img.onerror = () => finish(new Error("Kunne ikke lese logoens overflate."));
		signal.addEventListener("abort", cancel, { once: true });
		if (signal.aborted) {
			cancel();
			return;
		}
		img.src = url;
	});
}

function compile(gl, type, source) {
	const shader = gl.createShader(type);
	if (!shader) throw new Error("Kunne ikke opprette shader.");
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const error = gl.getShaderInfoLog(shader);
		gl.deleteShader(shader);
		throw new Error(error || "Shaderfeil.");
	}
	return shader;
}

/** GLB primitives keep their vertex attributes interleaved; no per-frame geometry rebuilds. */
async function makeGPU(canvas, buffer, signal) {
	const gl = canvas.getContext("webgl2", {
		alpha: true,
		antialias: true,
		premultipliedAlpha: true,
		powerPreference: "low-power",
	});
	if (!gl) return makeSoftware(canvas, buffer, signal);
	const { json, binary, meta } = parseGLB(buffer);
	const gpu = {
		kind: "webgl2",
		gl,
		meta,
		program: null,
		texture: null,
		primitives: [],
		buffers: [],
		shaders: [],
	};
	try {
		const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
		gpu.shaders.push(vs);
		const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
		gpu.shaders.push(fs);
		const program = gl.createProgram();
		gpu.program = program;
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS))
			throw new Error(gl.getProgramInfoLog(program) || "Programfeil.");
		gl.useProgram(program);
		gpu.uniforms = Object.fromEntries(
			["uModel", "uNormal", "uView", "uTexture", "uTextured", "uLight", "uLightStrength"].map(
				(n) => [n, gl.getUniformLocation(program, n)],
			),
		);
		for (const p of json.meshes[0].primitives) {
			if (p.mode !== 4) throw new Error("Bare trekantgeometri støttes.");
			const vao = gl.createVertexArray();
			gl.bindVertexArray(vao);
			const data = { vao, count: 0, type: 0, offset: 0, textured: p.material === 0 };
			gpu.primitives.push(data);
			const uploaded = new Map();
			for (const [attribute, name, size] of [
				["POSITION", "aPosition", 3],
				["NORMAL", "aNormal", 3],
				["TEXCOORD_0", "aUV", 2],
			]) {
				const accessor = json.accessors[p.attributes[attribute]],
					bv = json.bufferViews[accessor.bufferView];
				if (accessor.componentType !== 5126) throw new Error("Forventet float-attributt.");
				let b = uploaded.get(accessor.bufferView);
				if (!b) {
					b = gl.createBuffer();
					gpu.buffers.push(b);
					uploaded.set(accessor.bufferView, b);
					gl.bindBuffer(gl.ARRAY_BUFFER, b);
					gl.bufferData(
						gl.ARRAY_BUFFER,
						binary.subarray(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength),
						gl.STATIC_DRAW,
					);
				} else gl.bindBuffer(gl.ARRAY_BUFFER, b);
				const loc = gl.getAttribLocation(program, name);
				gl.enableVertexAttribArray(loc);
				gl.vertexAttribPointer(
					loc,
					size,
					gl.FLOAT,
					false,
					bv.byteStride || 0,
					accessor.byteOffset || 0,
				);
			}
			const indices = json.accessors[p.indices],
				ibv = json.bufferViews[indices.bufferView];
			if (![5123, 5125].includes(indices.componentType)) throw new Error("Ugyldig indeksformat.");
			const ib = gl.createBuffer();
			gpu.buffers.push(ib);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
			gl.bufferData(
				gl.ELEMENT_ARRAY_BUFFER,
				binary.subarray(ibv.byteOffset || 0, (ibv.byteOffset || 0) + ibv.byteLength),
				gl.STATIC_DRAW,
			);
			Object.assign(data, {
				count: indices.count,
				type: indices.componentType,
				offset: indices.byteOffset || 0,
			});
		}
		const image = json.images[0],
			iv = json.bufferViews[image.bufferView];
		const pixels = await decodeImage(
			new Blob([binary.slice(iv.byteOffset || 0, (iv.byteOffset || 0) + iv.byteLength)], {
				type: image.mimeType,
			}),
			signal,
		);
		if (signal.aborted) throw new DOMException("Aborted", "AbortError");
		const texture = gl.createTexture();
		gpu.texture = texture;
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		// The GLTF asset uses top-left image UVs; do not flip the embedded PNG.
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.generateMipmap(gl.TEXTURE_2D);
		const anisotropy = gl.getExtension("EXT_texture_filter_anisotropic");
		if (anisotropy)
			gl.texParameterf(
				gl.TEXTURE_2D,
				anisotropy.TEXTURE_MAX_ANISOTROPY_EXT,
				Math.min(8, gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT)),
			);
		gl.uniform1i(gpu.uniforms.uTexture, 0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
		gl.frontFace(gl.CCW);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		gl.clearColor(0, 0, 0, 0);
		return gpu;
	} catch (error) {
		disposeGPU(gpu);
		throw error;
	}
}

function disposeGPU(gpu) {
	if (!gpu || gpu.kind === "software") return;
	const { gl } = gpu;
	gpu.primitives.forEach((p) => gl.deleteVertexArray(p.vao));
	gpu.buffers.forEach((b) => gl.deleteBuffer(b));
	gpu.shaders.forEach((s) => gl.deleteShader(s));
	if (gpu.texture) gl.deleteTexture(gpu.texture);
	if (gpu.program) gl.deleteProgram(gpu.program);
}

/** Column-major Y * X rotation. No background element receives this transform. */
function matrices(state, meta) {
	const a = Math.cos(state.yaw),
		b = Math.sin(state.yaw),
		c = Math.cos(state.pitch),
		d = Math.sin(state.pitch);
	const r = new Float32Array([a, 0, -b, b * d, c, a * d, b * c, -d, a * c]);
	const z = (state.depth * meta.svgUnitsToMeters) / meta.defaultDepth,
		s = state.zoom;
	const m = new Float32Array(16);
	for (let col = 0; col < 3; col++)
		for (let row = 0; row < 3; row++) m[col * 4 + row] = r[col * 3 + row] * s * (col === 2 ? z : 1);
	const vb = meta.viewBox;
	m[12] = (meta.pivotSvg[0] - vb[0] - vb[2] / 2) * meta.svgUnitsToMeters + (state.offsetX || 0);
	m[13] = (vb[1] + vb[3] / 2 - meta.pivotSvg[1]) * meta.svgUnitsToMeters + (state.offsetY || 0);
	m[15] = 1;
	return { model: m, normal: r };
}

/**
 * Software depth-buffer renderer for environments where WebGL is unavailable.
 * Uses the SAME GLB vertices/triangles, normals and texture: still a real 3D mesh.
 * Allocations are reused, and rendering runs only while the view is changing.
 */
async function makeSoftware(canvas, buffer, signal) {
	const { json, binary, meta } = parseGLB(buffer);
	const ctx = canvas.getContext("2d", { alpha: true });
	if (!ctx) throw new Error("Ingen tegnemotor er tilgjengelig.");
	const accessor = (index) => {
		const a = json.accessors[index],
			bv = json.bufferViews[a.bufferView];
		const size = { SCALAR: 1, VEC2: 2, VEC3: 3 }[a.type];
		const bytes = a.componentType === 5123 ? 2 : 4;
		const stride = bv.byteStride || size * bytes;
		const v = new DataView(binary.buffer, binary.byteOffset + (bv.byteOffset || 0));
		const out =
			a.componentType === 5126 ? new Float32Array(a.count * size) : new Uint32Array(a.count * size);
		for (let i = 0; i < a.count; i++)
			for (let k = 0; k < size; k++) {
				const at = (a.byteOffset || 0) + i * stride + k * bytes;
				out[i * size + k] =
					a.componentType === 5126
						? v.getFloat32(at, true)
						: bytes === 2
							? v.getUint16(at, true)
							: v.getUint32(at, true);
			}
		return out;
	};
	const primitives = json.meshes[0].primitives.map((p) => {
		const positions = accessor(p.attributes.POSITION);
		return {
			positions,
			normals: accessor(p.attributes.NORMAL),
			uv: accessor(p.attributes.TEXCOORD_0),
			indices: accessor(p.indices),
			textured: p.material === 0,
			projected: new Float32Array(positions.length),
		};
	});
	const image = json.images[0],
		iv = json.bufferViews[image.bufferView];
	const decoded = await decodeImage(
		new Blob([binary.slice(iv.byteOffset || 0, (iv.byteOffset || 0) + iv.byteLength)], {
			type: image.mimeType,
		}),
		signal,
	);
	const surface = document.createElement("canvas");
	surface.width = decoded.width;
	surface.height = decoded.height;
	const ink = surface.getContext("2d", { willReadFrequently: true });
	ink.drawImage(decoded, 0, 0);
	const pixels = ink.getImageData(0, 0, surface.width, surface.height);
	return {
		kind: "software",
		meta,
		canvas,
		ctx,
		primitives,
		pixels,
		image: null,
		depthBuffer: null,
	};
}

function drawSoftware(gpu, state, viewWidth, viewHeight) {
	const { canvas, ctx, primitives, pixels, meta } = gpu;
	const w = canvas.width,
		h = canvas.height;
	if (!gpu.image || gpu.image.width !== w || gpu.image.height !== h) {
		gpu.image = ctx.createImageData(w, h);
		gpu.depthBuffer = new Float32Array(w * h);
	}
	const output = gpu.image.data,
		zbuffer = gpu.depthBuffer;
	output.fill(0);
	zbuffer.fill(-Infinity);
	const { model: m, normal: n } = matrices(state, meta);
	const sx = w / viewWidth,
		sy = h / viewHeight;
	const tex = pixels.data,
		tw = pixels.width,
		th = pixels.height;
	const normalize = (a) => {
		const l = Math.hypot(...a);
		return a.map((v) => v / l);
	};
	const key = normalize([-0.65, 0.85, 1.3]),
		rim = normalize([1, 0.2, 0.45]),
		half = normalize([key[0], key[1], key[2] + 1]);
	for (const p of primitives) {
		const { positions: v, projected: q, indices: ix, uv } = p;
		for (let i = 0; i < v.length; i += 3) {
			const x = v[i],
				y = v[i + 1],
				z = v[i + 2];
			q[i] = (m[0] * x + m[4] * y + m[8] * z + m[12]) * sx + w / 2;
			q[i + 1] = h / 2 - (m[1] * x + m[5] * y + m[9] * z + m[13]) * sy;
			q[i + 2] = m[2] * x + m[6] * y + m[10] * z;
		}
		for (let j = 0; j < ix.length; j += 3) {
			const ai = ix[j],
				bi = ix[j + 1],
				ci = ix[j + 2];
			const ax = q[ai * 3],
				ay = q[ai * 3 + 1],
				az = q[ai * 3 + 2];
			const bx = q[bi * 3],
				by = q[bi * 3 + 1],
				bz = q[bi * 3 + 2];
			const cx = q[ci * 3],
				cy = q[ci * 3 + 1],
				cz = q[ci * 3 + 2];
			const area = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
			// Canvas y is downward, so CCW front faces have a negative projected area.
			if (area >= -1e-7) continue;
			const minX = Math.max(0, Math.floor(Math.min(ax, bx, cx))),
				maxX = Math.min(w - 1, Math.ceil(Math.max(ax, bx, cx)));
			const minY = Math.max(0, Math.floor(Math.min(ay, by, cy))),
				maxY = Math.min(h - 1, Math.ceil(Math.max(ay, by, cy)));
			if (maxX < minX || maxY < minY) continue;
			const inv = 1 / area;
			const d0x = (by - cy) * inv,
				d0y = (cx - bx) * inv;
			const d1x = (cy - ay) * inv,
				d1y = (ax - cx) * inv;
			const c0 = (bx * cy - by * cx) * inv,
				c1 = (cx * ay - cy * ax) * inv;
			const au = uv[ai * 2],
				av = uv[ai * 2 + 1],
				bu = uv[bi * 2],
				bv = uv[bi * 2 + 1],
				cu = uv[ci * 2],
				cv = uv[ci * 2 + 1];
			let edge = [0, 0, 0];
			if (!p.textured) {
				const nx = p.normals[ai * 3],
					ny = p.normals[ai * 3 + 1],
					nz = p.normals[ai * 3 + 2];
				const normal = [
					n[0] * nx + n[3] * ny + n[6] * nz,
					n[1] * nx + n[4] * ny + n[7] * nz,
					n[2] * nx + n[5] * ny + n[8] * nz,
				];
				const dot = (a) => Math.max(0, normal[0] * a[0] + normal[1] * a[1] + normal[2] * a[2]);
				const diffuse = 0.48 + 0.64 * dot(key) + 0.24 * dot(rim),
					spec = Math.pow(dot(half), 38) * 0.13;
				edge = [0.18, 0.193, 0.205].map((c) => Math.round((c * diffuse + spec) * 255));
			}
			for (let y = minY; y <= maxY; y++) {
				let b0 = d0x * (minX + 0.5) + d0y * (y + 0.5) + c0;
				let b1 = d1x * (minX + 0.5) + d1y * (y + 0.5) + c1;
				for (let x = minX; x <= maxX; x++, b0 += d0x, b1 += d1x) {
					const b2 = 1 - b0 - b1;
					if (b0 < -1e-6 || b1 < -1e-6 || b2 < -1e-6) continue;
					const z = b0 * az + b1 * bz + b2 * cz,
						pixel = y * w + x;
					if (z < zbuffer[pixel] - 1e-7) continue;
					const dest = pixel * 4;
					if (p.textured) {
						const u = clamp((b0 * au + b1 * bu + b2 * cu) * tw - 0.5, 0, tw - 1),
							v0 = clamp((b0 * av + b1 * bv + b2 * cv) * th - 0.5, 0, th - 1);
						const x0 = Math.floor(u),
							y0 = Math.floor(v0),
							x1 = Math.min(x0 + 1, tw - 1),
							y1 = Math.min(y0 + 1, th - 1);
						const fx = u - x0,
							fy = v0 - y0;
						const t00 = (y0 * tw + x0) * 4,
							t10 = (y0 * tw + x1) * 4,
							t01 = (y1 * tw + x0) * 4,
							t11 = (y1 * tw + x1) * 4;
						const w00 = (1 - fx) * (1 - fy),
							w10 = fx * (1 - fy),
							w01 = (1 - fx) * fy,
							w11 = fx * fy;
						const alpha =
							tex[t00 + 3] * w00 + tex[t10 + 3] * w10 + tex[t01 + 3] * w01 + tex[t11 + 3] * w11;
						if (alpha < 4) continue;
						for (let c = 0; c < 3; c++)
							output[dest + c] =
								tex[t00 + c] * w00 + tex[t10 + c] * w10 + tex[t01 + c] * w01 + tex[t11 + c] * w11;
						output[dest + 3] = alpha;
					} else {
						output[dest] = edge[0];
						output[dest + 1] = edge[1];
						output[dest + 2] = edge[2];
						output[dest + 3] = 255;
					}
					zbuffer[pixel] = z;
				}
			}
		}
	}
	if (state.lightStrength > 0.0001) {
		const tint = [237, 245, 255];
		for (let y = 0; y < h; y++) {
			const dy = state.lightY - (h / 2 - y - 0.5) / sy;
			for (let x = 0; x < w; x++) {
				const at = (y * w + x) * 4;
				if (!output[at + 3]) continue;
				const dx = state.lightX - (x + 0.5 - w / 2) / sx;
				const spot = Math.exp(-(dx * dx + dy * dy) / 0.055);
				const glow = spot * 0.28 * state.lightStrength;
				for (let c = 0; c < 3; c++) output[at + c] += (tint[c] - output[at + c]) * glow;
			}
		}
	}
	ctx.putImageData(gpu.image, 0, 0);
}

class DingLogo extends HTMLElement {
	constructor() {
		super();
		this._gpu = null;
		this._raf = 0;
		this._generation = 0;
		this._lastTime = 0;
		this._visible = false;
		this._loading = false;
		this._spin = false;
		this._points = new Map();
		this._pinch = null;
	}
	connectedCallback() {
		queueMicrotask(() => {
			if (this.isConnected && !this._events) this._connect();
		});
	}
	disconnectedCallback() {
		this._disconnect();
	}

	_connect() {
		this._canvas = this.querySelector("canvas");
		this._status = this.querySelector("[data-status]");
		this._stage = this.querySelector("[data-stage]");
		if (!this._canvas || !this._stage) return;
		this._events = new AbortController();
		const signal = this._events.signal;
		this._motion = matchMedia("(prefers-reduced-motion: reduce)");
		this._state = {
			yaw: rad(Number(this.dataset.angle) || 0),
			pitch: 0,
			zoom: 1,
			depth: clamp(Number(this.dataset.depth) || 32, 4, 64),
		};
		this._target = { ...this._state };
		// Hover is a temporary offset; dragging and presets keep their own orientation.
		this._hover = { yaw: 0, pitch: 0, x: 0, y: 0, lightX: 0, lightY: 0, strength: 0 };
		this._hoverTarget = { ...this._hover };
		this._spin = !this._motion.matches;
		this._points.clear();
		this._pinch = null;
		this.dataset.state = "static";
		this._setControls(false);
		this._syncUI();
		this._canvas.addEventListener("pointerdown", (e) => this._pointerDown(e), { signal });
		this._canvas.addEventListener("pointermove", (e) => this._pointerMove(e), { signal });
		this._canvas.addEventListener("pointerenter", (e) => this._pointerHover(e), { signal });
		this._canvas.addEventListener("pointerleave", () => this._clearHover(), { signal });
		window.addEventListener("blur", () => this._clearHover(), { signal });
		for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
			this._canvas.addEventListener(event, (e) => this._pointerUp(e), { signal });
		this._canvas.addEventListener("keydown", (e) => this._key(e), { signal });
		this._settings = this.querySelector("[data-settings]");
		this._settings?.addEventListener(
			"toggle",
			() => {
				if (this._settings.open) this._clearHover();
			},
			{ signal },
		);
		document.addEventListener(
			"pointerdown",
			(e) => {
				if (this._settings?.open && !this._settings.contains(e.target)) this._settings.open = false;
			},
			{ signal },
		);
		this.addEventListener(
			"keydown",
			(e) => {
				if (e.key === "Escape" && this._settings?.open) {
					this._settings.open = false;
					this._settings.querySelector("summary")?.focus();
					e.preventDefault();
				}
			},
			{ signal },
		);
		this._settings?.addEventListener(
			"focusout",
			(e) => {
				if (e.relatedTarget && !this._settings.contains(e.relatedTarget))
					this._settings.open = false;
			},
			{ signal },
		);
		this._canvas.addEventListener(
			"wheel",
			(e) => {
				// Ordinary scrolling remains page scrolling; the zoom buttons also work on touch.
				if (!(e.ctrlKey || e.metaKey)) return;
				e.preventDefault();
				this._target.zoom = clamp(this._target.zoom * Math.exp(-e.deltaY * 0.004), 0.7, 1.3);
				this._syncUI();
				this._invalidate();
			},
			{ passive: false, signal },
		);
		this.addEventListener(
			"click",
			(e) => {
				const button = e.target instanceof Element ? e.target.closest("button[data-action]") : null;
				if (button && this.contains(button) && !button.disabled)
					this._action(button.dataset.action);
			},
			{ signal },
		);
		this.querySelector("[data-depth]")?.addEventListener(
			"input",
			(e) => {
				this._target.depth = clamp(Number(e.target.value), 4, 64);
				this._syncUI();
				this._invalidate();
			},
			{ signal },
		);
		this._motion.addEventListener(
			"change",
			() => {
				this._spin = false;
				this._clearHover(true);
				this._syncUI();
				this._invalidate();
			},
			{ signal },
		);
		document.addEventListener(
			"visibilitychange",
			() => {
				if (document.hidden) {
					this._clearHover(true);
					this._stopFrame();
				} else {
					this._lastTime = 0;
					this._invalidate();
				}
			},
			{ signal },
		);
		this._canvas.addEventListener(
			"webglcontextlost",
			(e) => {
				e.preventDefault();
				this._stopFrame();
				this._generation++;
				this._loadAbort?.abort();
				this._loading = false;
				disposeGPU(this._gpu);
				this._gpu = null;
				this.dataset.state = "static";
				this._setControls(false);
				this._status.textContent = "3D er satt på pause. Logoen vises som SVG.";
			},
			{ signal },
		);
		this._canvas.addEventListener("webglcontextrestored", () => this._load(), { signal });
		this._resizeObserver = new ResizeObserver(() => this._resize());
		this._resizeObserver.observe(this._stage);
		this._observer = new IntersectionObserver(
			(entries) => {
				this._visible = entries[0].isIntersecting;
				if (this._visible) {
					if (!this._gpu && !this._loading && this.dataset.state !== "error") this._load();
					this._lastTime = 0;
					this._invalidate();
				} else {
					this._clearHover(true);
					this._stopFrame();
				}
			},
			{ rootMargin: "80px" },
		);
		this._observer.observe(this);
		this._resize();
	}

	async _load() {
		if (this._loading || !this.isConnected || !this._canvas) return;
		this._loading = true;
		this.dataset.state = "loading";
		this._status.textContent = "Laster 3D-logo …";
		const generation = ++this._generation,
			controller = new AbortController();
		this._loadAbort = controller;
		const timeout = setTimeout(() => controller.abort(), 20000);
		let gpu = null;
		try {
			let bytes = this._bytes;
			if (!bytes) {
				if (!this.dataset.modelSrc) throw new Error("Modelladresse mangler.");
				const response = await fetch(this.dataset.modelSrc, { signal: controller.signal });
				if (!response.ok) throw new Error(`HTTP ${response.status} ved lasting av modellen.`);
				bytes = await response.arrayBuffer();
				this._bytes = bytes;
			}
			gpu = await makeGPU(this._canvas, bytes, controller.signal);
			if (generation !== this._generation || !this.isConnected) {
				disposeGPU(gpu);
				return;
			}
			this._gpu = gpu;
			if (this._lastPointer) this._pointerHover(this._lastPointer);
			this.dataset.renderer = gpu.kind;
			this._resize();
			this._render();
			this.dataset.state = "ready";
			this._setControls(true);
			this._canvas.tabIndex = 0;
			this._status.textContent = "3D-logoen er klar. Dra for å rotere; bakgrunnen står stille.";
			this._invalidate();
		} catch (error) {
			if (generation !== this._generation || !this.isConnected) return;
			this.dataset.state = "error";
			this._setControls(false);
			this._canvas.tabIndex = -1;
			this._status.textContent = "3D kunne ikke starte. Logoen vises som vanlig SVG.";
			console.warn("[DingLogo3D]", error);
		} finally {
			clearTimeout(timeout);
			if (generation === this._generation) this._loading = false;
		}
	}

	_resize() {
		if (!this._canvas) return;
		const { width, height } = this._stage.getBoundingClientRect();
		if (width <= 0 || height <= 0) return;
		this._width = width;
		this._height = height;
		const dpr = Math.min(devicePixelRatio || 1, this._gpu?.kind === "software" ? 1.5 : 2);
		const w = Math.round(width * dpr),
			h = Math.round(height * dpr);
		if (this._canvas.width !== w || this._canvas.height !== h) {
			this._canvas.width = w;
			this._canvas.height = h;
		}
		if (this._gpu?.gl) this._gpu.gl.viewport(0, 0, w, h);
		this._invalidate();
	}

	_render() {
		const gpu = this._gpu;
		if (!gpu || !this._width) return;
		const { gl, uniforms, meta } = gpu;
		const cover = Math.max(this._width / meta.viewBox[2], this._height / meta.viewBox[3]);
		const viewState = {
			...this._state,
			yaw: this._state.yaw + this._hover.yaw,
			pitch: this._state.pitch + this._hover.pitch,
			offsetX: ((this._hover.x * 8) / cover) * meta.svgUnitsToMeters,
			offsetY: ((-this._hover.y * 6) / cover) * meta.svgUnitsToMeters,
			lightX: ((this._hover.lightX * this._width) / (2 * cover)) * meta.svgUnitsToMeters,
			lightY: ((-this._hover.lightY * this._height) / (2 * cover)) * meta.svgUnitsToMeters,
			lightStrength: this._hover.strength,
		};
		if (gpu.kind === "software") {
			drawSoftware(
				gpu,
				viewState,
				(this._width / cover) * meta.svgUnitsToMeters,
				(this._height / cover) * meta.svgUnitsToMeters,
			);
			return;
		}
		if (gl.isContextLost()) return;
		const { model, normal } = matrices(viewState, meta);
		gl.useProgram(gpu.program);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.uniformMatrix4fv(uniforms.uModel, false, model);
		gl.uniformMatrix3fv(uniforms.uNormal, false, normal);
		gl.uniform2f(uniforms.uLight, viewState.lightX, viewState.lightY);
		gl.uniform1f(uniforms.uLightStrength, viewState.lightStrength);
		gl.uniform2f(
			uniforms.uView,
			(this._width / cover) * meta.svgUnitsToMeters,
			(this._height / cover) * meta.svgUnitsToMeters,
		);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, gpu.texture);
		for (const primitive of gpu.primitives) {
			gl.bindVertexArray(primitive.vao);
			gl.uniform1i(uniforms.uTextured, primitive.textured ? 1 : 0);
			gl.drawElements(gl.TRIANGLES, primitive.count, primitive.type, primitive.offset);
		}
		gl.bindVertexArray(null);
	}

	_invalidate() {
		if (!this._raf && this._gpu && this._visible && !document.hidden)
			this._raf = requestAnimationFrame((t) => this._frame(t));
	}
	_frame(time) {
		this._raf = 0;
		if (!this._gpu || !this._visible || document.hidden) return;
		const dt = this._lastTime ? Math.min((time - this._lastTime) / 1000, 0.05) : 1 / 60;
		this._lastTime = time;
		if (this._spin && !this._points.size) this._target.yaw += dt * 0.3;
		const weight = this._motion.matches ? 1 : 1 - Math.exp(-16 * dt);
		let moving = false;
		for (const key of ["yaw", "pitch", "zoom", "depth"]) {
			const delta = this._target[key] - this._state[key];
			if (Math.abs(delta) > 0.0001) {
				this._state[key] += delta * weight;
				moving = true;
			} else this._state[key] = this._target[key];
		}
		const hoverWeight = this._motion.matches ? 1 : 1 - Math.exp(-10 * dt);
		for (const key of Object.keys(this._hover)) {
			const delta = this._hoverTarget[key] - this._hover[key];
			if (Math.abs(delta) > 0.0001) {
				this._hover[key] += delta * hoverWeight;
				moving = true;
			} else this._hover[key] = this._hoverTarget[key];
		}
		this._render();
		if (moving || this._spin) this._invalidate();
		else this._lastTime = 0;
	}
	_stopFrame() {
		if (this._raf) cancelAnimationFrame(this._raf);
		this._raf = 0;
		this._lastTime = 0;
	}

	_clearHover(immediate = false) {
		this._lastPointer = null;
		for (const key of Object.keys(this._hover)) {
			// Let the reflection fade where the pointer left it.
			if (key === "lightX" || key === "lightY") continue;
			this._hoverTarget[key] = 0;
			if (immediate) this._hover[key] = 0;
		}
		this._invalidate();
	}

	_pointerHover(e) {
		if (
			e.pointerType !== "mouse" ||
			this._settings?.open ||
			e.buttons ||
			this._points.size ||
			this._motion.matches ||
			this._spin
		)
			return;
		this._lastPointer = {
			pointerType: "mouse",
			buttons: 0,
			clientX: e.clientX,
			clientY: e.clientY,
		};
		if (!this._gpu) return;
		const rect = this._canvas.getBoundingClientRect();
		if (!rect.width || !rect.height) return;
		const { viewBox, boundsSvg, pivotSvg } = this._gpu.meta;
		const cover = Math.max(rect.width / viewBox[2], rect.height / viewBox[3]);
		const cx = rect.width / 2 + (pivotSvg[0] - viewBox[0] - viewBox[2] / 2) * cover;
		const cy = rect.height / 2 + (pivotSvg[1] - viewBox[1] - viewBox[3] / 2) * cover;
		// Use the logo's footprint, not the much wider backdrop, for a visible response at rest.
		const halfWidth = Math.max(1, ((boundsSvg[2] - boundsSvg[0]) * cover * this._state.zoom) / 2);
		const halfHeight = Math.max(1, ((boundsSvg[3] - boundsSvg[1]) * cover * this._state.zoom) / 2);
		const px = e.clientX - rect.left,
			py = e.clientY - rect.top;
		const x = clamp((px - cx) / halfWidth, -1, 1);
		const y = clamp((py - cy) / halfHeight, -1, 1);
		Object.assign(this._hoverTarget, {
			yaw: x * HOVER_YAW,
			pitch: y * HOVER_PITCH,
			x,
			y,
			lightX: clamp((px / rect.width) * 2 - 1, -1, 1),
			lightY: clamp((py / rect.height) * 2 - 1, -1, 1),
			strength: 1,
		});
		this._invalidate();
	}

	_pointerDown(e) {
		if (!this._gpu || (e.pointerType === "mouse" && e.button !== 0)) return;
		this._clearHover();
		this._points.set(e.pointerId, { x: e.clientX, y: e.clientY });
		this._canvas.setPointerCapture(e.pointerId);
		this._spin = false;
		this.dataset.dragging = "true";
		if (this._points.size === 2) {
			const [a, b] = [...this._points.values()];
			this._pinch = { distance: Math.hypot(b.x - a.x, b.y - a.y), zoom: this._target.zoom };
		}
		this._syncUI();
	}
	_pointerMove(e) {
		// Recover if the browser lost a mouse-up outside the window.
		if (e.pointerType === "mouse" && !e.buttons && this._points.size) {
			this._points.clear();
			this._pinch = null;
			delete this.dataset.dragging;
		}
		const last = this._points.get(e.pointerId);
		if (!last) {
			this._pointerHover(e);
			return;
		}
		this._points.set(e.pointerId, { x: e.clientX, y: e.clientY });
		if (this._points.size === 2 && this._pinch) {
			const [a, b] = [...this._points.values()];
			this._target.zoom = clamp(
				(this._pinch.zoom * Math.hypot(b.x - a.x, b.y - a.y)) / Math.max(1, this._pinch.distance),
				0.7,
				1.3,
			);
			this._syncUI();
		} else {
			this._target.yaw += (e.clientX - last.x) * 0.009;
			// A vertical one-finger gesture remains native page scrolling on mobile.
			if (e.pointerType !== "touch")
				this._target.pitch = clamp(this._target.pitch + (e.clientY - last.y) * 0.006, -1.05, 1.05);
		}
		this._invalidate();
	}
	_pointerUp(e) {
		if (e.type === "pointercancel") this._clearHover();
		this._points.delete(e.pointerId);
		this._pinch = null;
		if (!this._points.size) {
			delete this.dataset.dragging;
			this._invalidate();
		}
	}
	_key(e) {
		const actions = {
			ArrowLeft: "left",
			ArrowRight: "right",
			ArrowUp: "up",
			ArrowDown: "down",
			Home: "reset",
			"+": "zoom-in",
			"=": "zoom-in",
			"-": "zoom-out",
		};
		const action = actions[e.key];
		if (!action) return;
		e.preventDefault();
		this._action(action);
	}
	_action(action) {
		if (!this._gpu) return;
		this._clearHover();
		if (action !== "spin") this._spin = false;
		// Use the nearest equivalent angle so reset does not cause several extra revolutions.
		const nearest = (angle) =>
			this._target.yaw +
			Math.atan2(Math.sin(angle - this._target.yaw), Math.cos(angle - this._target.yaw));
		switch (action) {
			case "front":
				this._target.yaw = nearest(0);
				this._target.pitch = 0;
				break;
			case "angle":
				this._target.yaw = nearest(-0.62);
				this._target.pitch = -0.1;
				break;
			case "back":
				this._target.yaw = nearest(Math.PI);
				this._target.pitch = 0;
				break;
			case "left":
				this._target.yaw -= 0.16;
				break;
			case "right":
				this._target.yaw += 0.16;
				break;
			case "up":
				this._target.pitch = clamp(this._target.pitch - 0.12, -1.05, 1.05);
				break;
			case "down":
				this._target.pitch = clamp(this._target.pitch + 0.12, -1.05, 1.05);
				break;
			case "zoom-in":
				this._target.zoom = clamp(this._target.zoom + 0.1, 0.7, 1.3);
				break;
			case "zoom-out":
				this._target.zoom = clamp(this._target.zoom - 0.1, 0.7, 1.3);
				break;
			case "spin":
				this._spin = !this._spin;
				break;
			case "reset":
				this._target = {
					yaw: nearest(0),
					pitch: 0,
					zoom: 1,
					depth: clamp(Number(this.dataset.depth) || 32, 4, 64),
				};
				break;
			default:
				return;
		}
		this._syncUI();
		this._invalidate();
	}
	_syncUI() {
		const zoom = this.querySelector("[data-zoom-value]");
		if (zoom) zoom.textContent = `${Math.round(this._target.zoom * 100)} %`;
		const depth = this.querySelector("[data-depth]");
		if (depth) depth.value = String(this._target.depth);
		const spin = this.querySelector('[data-action="spin"]');
		if (spin) {
			spin.setAttribute("aria-pressed", String(this._spin));
			spin.textContent = this._spin ? "Stopp rotasjon" : "Roter automatisk";
		}
	}
	_setControls(enabled) {
		this.querySelectorAll("[data-controls] button, [data-controls] input").forEach((el) => {
			el.disabled = !enabled;
		});
	}
	_disconnect() {
		this._generation++;
		this._loadAbort?.abort();
		this._loading = false;
		this._events?.abort();
		this._events = null;
		this._observer?.disconnect();
		this._observer = null;
		this._resizeObserver?.disconnect();
		this._resizeObserver = null;
		this._stopFrame();
		disposeGPU(this._gpu);
		this._gpu = null;
		this._points.clear();
		this._pinch = null;
		this._spin = false;
		// The decoded bytes may be reused if Astro reconnects the same element.
	}
}

if (!customElements.get(TAG)) customElements.define(TAG, DingLogo);
