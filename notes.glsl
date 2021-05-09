


// what is a UV
  // a uv is an x and y coordinate
    // example: [0, 0]
  // uv mapping is the process of mapping a 2d image onto a 3d object
  // u and v represent the axes of the 2d texture because x y and z are taken
  // also called texture coordinates

// where tf is uv coming from here?
  // comes from three.js, it is an attribute

// an attribute is a variable you can access which gives extra information relating to a vertex such as space position, color, normal direction and texture coordinates


// a matrix is just an array of data where groupings represent certain things


// Helpful links:
  - Three.js Uniforms and Attributes: https://threejs.org/docs/index.html?q=web#api/en/renderers/webgl/WebGLProgram
  - GLSL Documentation
    - Mat4: https://thebookofshaders.com/glossary/?search=mat4#:~:text=mat4%20data%20type%20is%20compose,components%20on%20the%20main%20diagonal.
    - Texture2D: https://thebookofshaders.com/glossary/?search=texture2D
    - Dot Operator: https://thebookofshaders.com/glossary/?search=dot
    - Normalize: https://thebookofshaders.com/glossary/?search=normalize




// projectionMatrix: mat4 (4x4 matrix)
mat4 aMat4 = mat4(1.0, 0.0, 0.0, 0.0,  // 1. column
                  0.0, 1.0, 0.0, 0.0,  // 2. column
                  0.0, 0.0, 1.0, 0.0,  // 3. column
                  0.0, 0.0, 0.0, 1.0); // 4. column

// modelViewMatrix: mat4 (4x4 matrix)
mat4 aMat4 = mat4(1.0, 0.0, 0.0, 0.0,  // 1. column
                  0.0, 1.0, 0.0, 0.0,  // 2. column
                  0.0, 0.0, 1.0, 0.0,  // 3. column
                  0.0, 0.0, 0.0, 1.0); // 4. column

// position: vec3 (3 element array)
vec3 position = vec3(1, 0, 0)


// vec4(position, 1.0) === vec4(1, 0, 0, 1.0)


// position * vec3(2, 2, 1) === vec3(1, 0, 0) * vec3(2, 2, 1)
  // x = 1 * 2 = 2
  // y = 0 * 2
  // z = 0 * 1
  // position = vec3(2, 0, 0)


// texture2D returns pixel value for a texture at any given coordinate
// need a way to determine what coordinate you're on
// if sphere were laid out into 2 dimensions, there would be x / y coordinates associated with it

attribute vec2 uv === [0, 1]
